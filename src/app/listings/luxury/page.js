'use client'

import { useState, useEffect } from 'react'
import Header from '../../../components/Header'
import Services from '../../../components/Services-lease'
import Footer from '../../../components/Footer'
import { fetchProjectsByType } from '../../../utils/projectapi'
import DreamPropertySection from '../../../components/DreamPropertySection'
export default function LuxuryPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { value: "0", label: "Total Projects" },
    { value: "0", label: "Completed" },
    { value: "0", label: "Upcoming" },
    { value: "0", label: "Owned" },

  ])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        // Fetch projects with projectType "Luxury" for the luxury listings page
        const fetchedProjects = await fetchProjectsByType("Luxury", {
          page: 1,
          limit: 100, // Get more projects to filter properly
          status: "active",
        })

        setProjects(fetchedProjects)

        // Calculate stats from projects
        const total = fetchedProjects.length
        const completed = fetchedProjects.filter(p => p.statusType === "completed").length
        const ongoing = fetchedProjects.filter(p => p.statusType === "ongoing").length
        const upcoming = fetchedProjects.filter(p => p.statusType === "upcoming" || (!p.statusType || p.statusType === "")).length
        const owned = fetchedProjects.filter(p => p.projectOwnership && p.projectOwnership.toLowerCase() === "owned").length

        setStats([
          { value: total.toString().padStart(2, "0"), label: "Total Projects" },
          { value: completed.toString().padStart(2, "0"), label: "Completed" },
          { value: upcoming.toString().padStart(2, "0"), label: "Upcoming" },
          { value: owned.toString().padStart(2, "0"), label: "Owned" },
        ])
      } catch (error) {
        console.error("Error fetching projects:", error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <main className="min-h-screen relative">
      <Header />
      <Services
        offeringType="lease"
        backgroundImage="/images_pages/services lease.png"
        stats={stats}
        filterButtons={["LUXURY", "COMMERCIAL", "INDUSTRIAL"]}
        category="luxury"
        luxury="true"
        projects={projects}
        loading={loading}
        useProjects={true}
      />

<DreamPropertySection title="Let’s find the perfect property for you…" 
  
description="Connect with our experienced advisors for tailored guidance on locations, unit types, and opportunities within our luxury projects. No obligation. Just clear, informed support." />

      <Footer />
    </main>
  )
}

