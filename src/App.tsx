import React from 'react';
import { Code, BarChart3, Users, FileText, CheckCircle } from 'lucide-react';
import { ManagementPage } from './components/ManagementPage';
import { StatisticsPage } from './components/StatisticsPage';
import { BlogManagementPage } from './components/BlogManagementPage';
import { UsedCodesPage } from './components/UsedCodesPage';
import { Button } from './components/ui/ui/button';
import { cn } from './lib/utils';

function App() {
  const [currentPage, setCurrentPage] = React.useState<'management' | 'statistics' | 'blog' | 'used-codes'>('management');

  const navigation = [
    { id: 'management', label: 'Manage Codes', icon: Users },
    { id: 'used-codes', label: 'Used Codes', icon: CheckCircle },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'blog', label: 'Blog Posts', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="https://assets.gwsave.com/header-logo.svg" 
                alt="GWsave" 
                className="h-4 mr-2"
              />
              <span className="text-lg font-semibold text-muted-foreground">Admin</span>
            </div>
            <nav className="flex items-center space-x-1">
              {navigation.map((nav) => (
                <Button
                  key={nav.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(nav.id as 'management' | 'statistics' | 'blog' | 'used-codes')}
                >
                  <nav.icon className="w-4 h-4 mr-2" />
                  {nav.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'management' && <ManagementPage />}
        {currentPage === 'used-codes' && <UsedCodesPage />}
        {currentPage === 'statistics' && <StatisticsPage />}
        {currentPage === 'blog' && <BlogManagementPage />}
      </main>

      <footer className="bg-card border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-muted-foreground">
            GWsave Promo Code Management System - Secure Backend Interface
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
