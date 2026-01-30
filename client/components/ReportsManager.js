'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar, TrendingUp, Users, Package, Building2, DollarSign } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import * as meetingService from '../services/meetingService';
import * as clientService from '../services/clientService';
import * as brandService from '../services/brandService';
import * as projectService from '../services/projectService';
import './ClientsManager.css';

const ReportsManager = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    meetings: [],
    clients: [],
    brands: [],
    projects: []
  });
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [selectedBrand, setSelectedBrand] = useState('all');

  useEffect(() => {
    fetchReportData();
  }, [dateRange, selectedBrand]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [meetings, clients, brands, projects] = await Promise.all([
        meetingService.getMeetings(),
        clientService.getClients(),
        brandService.getBrands(),
        projectService.getProjects()
      ]);

      // Filter by date range
      const filteredMeetings = meetings.filter(m => {
        const meetingDate = new Date(m.meeting_date);
        return meetingDate >= new Date(dateRange.start) && meetingDate <= new Date(dateRange.end);
      });

      // Filter by brand if selected
      const brandFilteredMeetings = selectedBrand === 'all'
        ? filteredMeetings
        : filteredMeetings.filter(m =>
            m.brand_discussions?.some(bd => bd.brand?.id === selectedBrand)
          );

      setReportData({
        meetings: brandFilteredMeetings,
        clients,
        brands,
        projects
      });
    } catch (error) {
      console.error('Failed to fetch report data:', error);
      alert('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const { meetings, projects } = reportData;

    // Total meetings
    const totalMeetings = meetings.length;

    // Unique clients met with
    const uniqueClients = new Set(meetings.map(m => m.client_id)).size;

    // Brands discussed
    const brandDiscussions = meetings.flatMap(m => m.brand_discussions || []);
    const uniqueBrands = new Set(brandDiscussions.map(bd => bd.brand?.id)).size;

    // Required brands (hit rate)
    const requiredBrands = brandDiscussions.filter(bd => bd.is_required).length;
    const hitRate = brandDiscussions.length > 0
      ? Math.round((requiredBrands / brandDiscussions.length) * 100)
      : 0;

    // Total estimated value from brand discussions
    const totalEstimatedValue = brandDiscussions.reduce((sum, bd) => {
      return sum + (parseFloat(bd.estimated_value) || 0);
    }, 0);

    // Active projects in date range
    const activeProjects = projects.filter(p => {
      if (!p.start_date) return false;
      const projectStart = new Date(p.start_date);
      return projectStart >= new Date(dateRange.start) && projectStart <= new Date(dateRange.end);
    }).length;

    // Project value in date range
    const projectValue = projects
      .filter(p => {
        if (!p.start_date) return false;
        const projectStart = new Date(p.start_date);
        return projectStart >= new Date(dateRange.start) && projectStart <= new Date(dateRange.end);
      })
      .reduce((sum, p) => sum + (parseFloat(p.estimated_value) || 0), 0);

    return {
      totalMeetings,
      uniqueClients,
      uniqueBrands,
      hitRate,
      totalEstimatedValue,
      activeProjects,
      projectValue
    };
  };

  const getBrandBreakdown = () => {
    const { meetings } = reportData;
    const brandStats = {};

    meetings.forEach(meeting => {
      meeting.brand_discussions?.forEach(bd => {
        if (!bd.brand) return;
        const brandId = bd.brand.id;
        if (!brandStats[brandId]) {
          brandStats[brandId] = {
            name: bd.brand.name,
            discussions: 0,
            required: 0,
            value: 0
          };
        }
        brandStats[brandId].discussions++;
        if (bd.is_required) brandStats[brandId].required++;
        brandStats[brandId].value += parseFloat(bd.estimated_value) || 0;
      });
    });

    return Object.values(brandStats).sort((a, b) => b.discussions - a.discussions);
  };

  const getClientBreakdown = () => {
    const { meetings } = reportData;
    const clientStats = {};

    meetings.forEach(meeting => {
      const clientId = meeting.client_id;
      if (!clientId || !meeting.client) return;
      
      if (!clientStats[clientId]) {
        clientStats[clientId] = {
          name: meeting.client.name,
          company: meeting.client.company,
          meetings: 0,
          brands: new Set()
        };
      }
      clientStats[clientId].meetings++;
      meeting.brand_discussions?.forEach(bd => {
        if (bd.brand) clientStats[clientId].brands.add(bd.brand.name);
      });
    });

    return Object.values(clientStats)
      .map(stat => ({
        ...stat,
        brands: stat.brands.size
      }))
      .sort((a, b) => b.meetings - a.meetings);
  };

  const exportToCSV = () => {
    const { meetings } = reportData;
    const stats = calculateStats();
    const brandBreakdown = getBrandBreakdown();

    let csv = 'INEXSS CRM - Monthly Report\n\n';
    csv += `Report Period:,${dateRange.start} to ${dateRange.end}\n`;
    csv += `Generated:,${format(new Date(), 'yyyy-MM-dd HH:mm')}\n\n`;

    csv += 'SUMMARY STATISTICS\n';
    csv += `Total Meetings,${stats.totalMeetings}\n`;
    csv += `Unique Clients,${stats.uniqueClients}\n`;
    csv += `Brands Discussed,${stats.uniqueBrands}\n`;
    csv += `Hit Rate,${stats.hitRate}%\n`;
    csv += `Estimated Value,R ${stats.totalEstimatedValue.toLocaleString()}\n`;
    csv += `Active Projects,${stats.activeProjects}\n`;
    csv += `Project Value,R ${stats.projectValue.toLocaleString()}\n\n`;

    csv += 'BRAND BREAKDOWN\n';
    csv += 'Brand,Discussions,Required,Value\n';
    brandBreakdown.forEach(brand => {
      csv += `"${brand.name}",${brand.discussions},${brand.required},R ${brand.value.toLocaleString()}\n`;
    });

    csv += '\nMEETINGS DETAIL\n';
    csv += 'Date,Client,Company,Location,Brands Discussed\n';
    meetings.forEach(meeting => {
      const brands = meeting.brand_discussions?.map(bd => bd.brand?.name).join('; ') || '';
      csv += `${format(new Date(meeting.meeting_date), 'yyyy-MM-dd')},"${meeting.client?.name}","${meeting.client?.company}","${meeting.location || ''}","${brands}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inexss-report-${dateRange.start}-to-${dateRange.end}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = calculateStats();
  const brandBreakdown = getBrandBreakdown();
  const clientBreakdown = getClientBreakdown();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reports-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <div className="header-icon">
            <BarChart3 size={32} />
          </div>
          <div>
            <h1>Reports & Analytics</h1>
            <p>Track performance and generate insights</p>
          </div>
        </div>
        <motion.button
          className="btn btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
        >
          <Download size={20} />
          <span>Export CSV</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Filter by Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="all">All Brands</option>
              {reportData.brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <motion.div
          className="stat-card"
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <Calendar size={24} />
            </div>
            <div className="stat-details">
              <p className="stat-label">Total Meetings</p>
              <h3 className="stat-value">{stats.totalMeetings}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <Users size={24} />
            </div>
            <div className="stat-details">
              <p className="stat-label">Unique Clients</p>
              <h3 className="stat-value">{stats.uniqueClients}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
              <Package size={24} />
            </div>
            <div className="stat-details">
              <p className="stat-label">Brands Discussed</p>
              <h3 className="stat-value">{stats.uniqueBrands}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-details">
              <p className="stat-label">Hit Rate</p>
              <h3 className="stat-value">{stats.hitRate}%</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)' }}>
              <DollarSign size={24} />
            </div>
            <div className="stat-details">
              <p className="stat-label">Discussion Value</p>
              <h3 className="stat-value">R {stats.totalEstimatedValue.toLocaleString()}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #54a0ff 0%, #2e86de 100%)' }}>
              <Building2 size={24} />
            </div>
            <div className="stat-details">
              <p className="stat-label">Active Projects</p>
              <h3 className="stat-value">{stats.activeProjects}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          whileHover={{ y: -5 }}
        >
          <div className="stat-card-inner">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)' }}>
              <DollarSign size={24} />
            </div>
            <div className="stat-details">
              <p className="stat-label">Project Value</p>
              <h3 className="stat-value">R {stats.projectValue.toLocaleString()}</h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Brand Breakdown */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Brand Performance</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '700' }}>Brand</th>
                <th style={{ textAlign: 'right', padding: '1rem', fontWeight: '700' }}>Discussions</th>
                <th style={{ textAlign: 'right', padding: '1rem', fontWeight: '700' }}>Required</th>
                <th style={{ textAlign: 'right', padding: '1rem', fontWeight: '700' }}>Hit Rate</th>
                <th style={{ textAlign: 'right', padding: '1rem', fontWeight: '700' }}>Est. Value</th>
              </tr>
            </thead>
            <tbody>
              {brandBreakdown.map((brand, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>{brand.name}</td>
                  <td style={{ textAlign: 'right', padding: '1rem' }}>{brand.discussions}</td>
                  <td style={{ textAlign: 'right', padding: '1rem', color: 'var(--success)' }}>{brand.required}</td>
                  <td style={{ textAlign: 'right', padding: '1rem' }}>
                    {brand.discussions > 0 ? Math.round((brand.required / brand.discussions) * 100) : 0}%
                  </td>
                  <td style={{ textAlign: 'right', padding: '1rem', fontWeight: '600' }}>
                    R {brand.value.toLocaleString()}
                  </td>
                </tr>
              ))}
              {brandBreakdown.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>
                    No brand discussions in this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Activity */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Client Activity</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '700' }}>Client</th>
                <th style={{ textAlign: 'left', padding: '1rem', fontWeight: '700' }}>Company</th>
                <th style={{ textAlign: 'right', padding: '1rem', fontWeight: '700' }}>Meetings</th>
                <th style={{ textAlign: 'right', padding: '1rem', fontWeight: '700' }}>Brands Discussed</th>
              </tr>
            </thead>
            <tbody>
              {clientBreakdown.map((client, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>{client.name}</td>
                  <td style={{ padding: '1rem' }}>{client.company}</td>
                  <td style={{ textAlign: 'right', padding: '1rem' }}>{client.meetings}</td>
                  <td style={{ textAlign: 'right', padding: '1rem' }}>{client.brands}</td>
                </tr>
              ))}
              {clientBreakdown.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>
                    No client meetings in this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsManager;
