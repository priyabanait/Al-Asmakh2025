"use client";

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DynamicServiceHero from '../../components/DynamicServiceHero'
import { usePathname } from 'next/navigation'

export default function OtherServicesPage() {
  const pathname = usePathname();
  
  // Extract service ID from pathname
  const getServiceId = () => {
    if (pathname.includes('services-sales')) return 'services-sales';
    if (pathname.includes('project-devlopment')) return 'project-development';
    if (pathname.includes('propertyManagement')) return 'property-management';
    if (pathname.includes('marketing')) return 'marketing';
    if (pathname.includes('become-an-agent')) return 'become-an-agent';
    return null; // Show all services
  };

  return (
    <main className="min-h-screen relative">
      <Header />
      <DynamicServiceHero serviceId={getServiceId()} />
      <Footer />
    </main> 
  )
}