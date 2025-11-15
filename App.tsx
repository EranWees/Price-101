import React, { useState } from 'react';
import { Page, PhotographyOrder, ReelsOrder, PortraitsOrder } from './types';
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import ServicesPage from './components/ServicesPage';
import AboutPage from './components/AboutPage';
import PhotographyBookingPage from './components/PhotographyBookingPage';
import ReelsBookingPage from './components/ReelsBookingPage';
import PortraitsBookingPage from './components/PortraitsBookingPage';
import BottomNavBar from './components/BottomNavBar';
import SideNavBar from './components/Header';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.Welcome);

  const [completedServices, setCompletedServices] = useState<string[]>([]);

  const [photographyOrder, setPhotographyOrder] = useState<PhotographyOrder>({
    peopleCount: '1-2',
    normalPictures: 0,
    expressPictures: {
      '24hrs': 0,
      '12hrs': 0,
      '6hrs': 0,
    },
  });

  const [reelsOrder, setReelsOrder] = useState<ReelsOrder>({
    basic: false,
    standard: false,
    premium: false,
  });

  const [portraitsOrder, setPortraitsOrder] = useState<PortraitsOrder>({
    a3: { quantity: 0 },
    a2: { quantity: 0 },
    a1: { quantity: 0 },
    a0: { quantity: 0 },
  });
  
  const handleNavigate = (newPage: Page) => {
    setPage(newPage);
  };

  const handlePhotographyComplete = () => {
    // FIX: The `reduce` function without an initial value can cause type inference issues.
    // Providing an initial value of 0 ensures `totalExpress` is correctly typed as a number.
    const totalExpress = Object.values(photographyOrder.expressPictures).reduce((a: number, b: number) => a + b, 0);
    if (photographyOrder.normalPictures > 0 || totalExpress > 0) {
      if (!completedServices.includes('photography')) {
        setCompletedServices(prev => [...prev, 'photography']);
      }
    } else {
        setCompletedServices(prev => prev.filter(s => s !== 'photography'));
    }
    handleNavigate(Page.Services);
  };

  const handleReelsComplete = () => {
    if (reelsOrder.basic || reelsOrder.standard || reelsOrder.premium) {
      if (!completedServices.includes('reels')) {
        setCompletedServices(prev => [...prev, 'reels']);
      }
    } else {
        setCompletedServices(prev => prev.filter(s => s !== 'reels'));
    }
    handleNavigate(Page.Services);
  };

  const handlePortraitsComplete = () => {
    // FIX: Replaced reduce with a for loop to avoid type inference issues causing `totalPortraits` to be `unknown`.
    let totalPortraits = 0;
    for (const key of Object.keys(portraitsOrder) as (keyof PortraitsOrder)[]) {
        totalPortraits += portraitsOrder[key].quantity;
    }
    if (totalPortraits > 0) {
        if (!completedServices.includes('portraits')) {
            setCompletedServices(prev => [...prev, 'portraits']);
        }
    } else {
        setCompletedServices(prev => prev.filter(s => s !== 'portraits'));
    }
    handleNavigate(Page.Services);
  };


  const renderPage = () => {
    switch (page) {
      case Page.Welcome:
        return <WelcomePage onNavigate={handleNavigate} />;
      case Page.Home:
        return <HomePage onNavigate={handleNavigate} />;
      case Page.Services:
        return <ServicesPage 
          onNavigate={handleNavigate} 
          completedServices={completedServices} 
          orders={{ photographyOrder, reelsOrder, portraitsOrder }} 
        />;
      case Page.About:
        return <AboutPage />;
      case Page.Photography:
        return <PhotographyBookingPage 
          order={photographyOrder} 
          setOrder={setPhotographyOrder} 
          onComplete={handlePhotographyComplete} 
        />;
      case Page.Reels:
        return <ReelsBookingPage 
          order={reelsOrder} 
          setOrder={setReelsOrder} 
          onComplete={handleReelsComplete} 
        />;
      case Page.Portraits:
        return <PortraitsBookingPage 
          order={portraitsOrder} 
          setOrder={setPortraitsOrder} 
          onComplete={handlePortraitsComplete}
        />;
      default:
        return <WelcomePage onNavigate={handleNavigate} />;
    }
  };
  
  if (page === Page.Welcome) {
    return <WelcomePage onNavigate={handleNavigate} />;
  }

  const showNavBar = [Page.Home, Page.Services, Page.About].includes(page);
  const showBackButton = [Page.Photography, Page.Reels, Page.Portraits].includes(page);

  return (
    <div className="flex w-full min-h-screen bg-zinc-900 text-white">
      <SideNavBar currentPage={page} onNavigate={handleNavigate} />
      <div className="relative flex-1">
        <main className="h-screen overflow-y-auto">
           <div className="pb-32 lg:pb-10 p-4 sm:p-8 md:p-10 relative">
              {showBackButton && (
                <button 
                  onClick={() => handleNavigate(Page.Services)} 
                  className="absolute top-8 left-8 w-12 h-12 rounded-full flex items-center justify-center text-white bg-black/30 backdrop-blur-md hover:bg-black/50 transition-colors z-50"
                  aria-label="Go back to services"
                >
                    <i className="fas fa-arrow-left text-lg"></i>
                </button>
              )}
              {renderPage()}
            </div>
        </main>
        <div className="lg:hidden">
          {showNavBar && <BottomNavBar currentPage={page} onNavigate={handleNavigate} />}
        </div>
      </div>
    </div>
  );
};

export default App;
