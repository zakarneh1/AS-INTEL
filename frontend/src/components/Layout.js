import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
    Sun, 
    Moon, 
    ChartLine, 
    House, 
    Lightbulb, 
    TreeStructure, 
    Info,
    List,
    X
} from '@phosphor-icons/react';
import { Button } from './ui/button';
import { ChatWidget } from './ChatWidget';
import logo from '../logo.png'; // new logo image

const navItems = [
    { path: '/', label: 'Home', icon: House },
    { path: '/dashboard', label: 'Dashboard', icon: ChartLine },
    { path: '/insights', label: 'Insights', icon: Lightbulb },
    { path: '/architecture', label: 'Architecture', icon: TreeStructure },
    { path: '/about', label: 'About', icon: Info },
];

export const Layout = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
                            <img src={logo} alt="AS Intelligence Logo" className="h-10 w-auto" />
                            <span className="font-bold text-lg hidden sm:block">AS Intelligence</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1" data-testid="desktop-nav">
                            {navItems.map(item => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                                            isActive 
                                                ? 'bg-primary/10 text-primary font-medium' 
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                    >
                                        <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right side actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                data-testid="theme-toggle"
                                className="rounded-md"
                            >
                                {theme === 'dark' ? (
                                    <Sun size={20} weight="regular" />
                                ) : (
                                    <Moon size={20} weight="regular" />
                                )}
                            </Button>

                            {/* Mobile menu button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden rounded-md"
                                data-testid="mobile-menu-toggle"
                            >
                                {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-border bg-background mobile-menu-backdrop" data-testid="mobile-nav">
                        <nav className="px-4 py-4 space-y-1">
                            {navItems.map(item => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                                        className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors duration-200 ${
                                            isActive 
                                                ? 'bg-primary/10 text-primary font-medium' 
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                    >
                                        <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Floating Chat Widget */}
            <ChatWidget />

            {/* Footer */}
            <footer className="border-t border-border bg-muted/30 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="AS Intelligence Logo" className="h-8 w-auto" />
                            <span className="font-semibold">AS Intelligence</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            E-commerce Analytics Platform - Powered by Olist Dataset
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;