import { useState, useCallback } from 'react';
import { SUMMARY_CARDS, HOURLY_SALES, DAILY_SALES, WEEKLY_SALES, MONTHLY_SALES, REVENUE_COMPARISON, SALES_BY_CATEGORY, PAYMENT_DISTRIBUTION, TOP_PRODUCTS, SLOW_MOVING_PRODUCTS, OUT_OF_STOCK, LOW_STOCK, INVENTORY_OVERVIEW, CUSTOMER_ANALYTICS, EMPLOYEE_ANALYTICS, STORE_PERFORMANCE, OPERATIONAL_ALERTS, FINANCIAL_OVERVIEW, ACTIVITY_FEED, DETAILED_SALES_RECORDS } from '@/constants/dashboard';
export function useDashboard() {
    const [dateRange, setDateRange] = useState('today');
    const [selectedStore, setSelectedStore] = useState('all');
    const [salesTab, setSalesTab] = useState('hourly');
    const [stockTab, setStockTab] = useState('lowStock');

    const handleSetDateRange = useCallback((range) => {
        setDateRange(range);
        // Automatically switch chart tab based on date range for better UX
        if (range === 'today' || range === 'yesterday') setSalesTab('hourly');
        else if (range === 'last7days') setSalesTab('daily');
        else if (range === 'thisMonth') setSalesTab('weekly');
    }, []);

    const getSalesData = useCallback(() => {
        switch (salesTab) {
            case 'hourly': return HOURLY_SALES.map(d => ({ label: d.hour, value: d.value }));
            case 'daily': return DAILY_SALES.map(d => ({ label: d.day, value: d.value }));
            case 'weekly': return WEEKLY_SALES.map(d => ({ label: d.week, value: d.value }));
            case 'monthly': return MONTHLY_SALES.map(d => ({ label: d.month, value: d.value }));
        }
    }, [salesTab]);

    const getStockData = useCallback(() => {
        switch (stockTab) {
            case 'slow': return SLOW_MOVING_PRODUCTS;
            case 'outOfStock': return OUT_OF_STOCK;
            case 'lowStock': return LOW_STOCK;
        }
    }, [stockTab]);

    // Mock data scaling based on date range
    const getMultiplier = () => {
        switch(dateRange) {
            case 'yesterday': return 0.95;
            case 'last7days': return 7.2;
            case 'thisMonth': return 28.5;
            default: return 1;
        }
    };
    
    const multiplier = getMultiplier();
    
    // Scale summary metrics to simulate database filtering
    const scaledSummary = {
        revenue: {
            today: SUMMARY_CARDS.revenue.today * multiplier,
            yesterday: SUMMARY_CARDS.revenue.yesterday * multiplier,
            growth: SUMMARY_CARDS.revenue.growth
        },
        orders: {
            total: Math.floor(SUMMARY_CARDS.orders.total * multiplier),
            completed: Math.floor(SUMMARY_CARDS.orders.completed * multiplier),
            pending: SUMMARY_CARDS.orders.pending // Pending usually doesn't scale
        },
        profit: {
            gross: SUMMARY_CARDS.profit.gross * multiplier,
            net: SUMMARY_CARDS.profit.net * multiplier,
            margin: SUMMARY_CARDS.profit.margin
        }
    };

    return {
        // Filters
        dateRange, setDateRange: handleSetDateRange,
        selectedStore, setSelectedStore,
        salesTab, setSalesTab,
        stockTab, setStockTab,
        // Data
        summary: scaledSummary,
        salesData: getSalesData(),
        revenueComparison: REVENUE_COMPARISON,
        salesByCategory: SALES_BY_CATEGORY,
        paymentDistribution: PAYMENT_DISTRIBUTION,
        topProducts: TOP_PRODUCTS,
        stockData: getStockData(),
        inventory: INVENTORY_OVERVIEW,
        customers: CUSTOMER_ANALYTICS,
        employees: EMPLOYEE_ANALYTICS,
        stores: STORE_PERFORMANCE,
        alerts: OPERATIONAL_ALERTS,
        financial: FINANCIAL_OVERVIEW,
        activities: ACTIVITY_FEED,
        detailedSales: DETAILED_SALES_RECORDS,
    };
}
