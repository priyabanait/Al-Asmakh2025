'use client'

import { useState, useEffect } from 'react'
import Header from '../../../components/Header'
import Services from '../../../components/Services-lease'
import Footer from '../../../components/Footer'
import DreamPropertySection from '../../../components/DreamPropertySection'
import { fetchProjects } from '../../../utils/projectapi'

export default function AllProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { value: "0", label: "Total Projects" },
    { value: "0", label: "Completed" },
    { value: "0", label: "Upcoming" },
    { value: "0", label: "Owned" },

  ])

  useEffect(() => {
    const loadAllProjects = async () => {
      try {
        setLoading(true)

        // Fetch all active projects (no projectType filter)
        const result = await fetchProjects({
          page: 1,
          limit: 200,
          status: "active",
        })

        const allProjects = result.projects || []
        setProjects(allProjects)

        // Calculate stats from all projects
        const total = allProjects.length
        const completed = allProjects.filter(p => p.statusType === "completed").length
        const ongoing = allProjects.filter(p => p.statusType === "ongoing").length
        const upcoming = allProjects.filter(
          p => p.statusType === "upcoming" || (!p.statusType || p.statusType === "")
        ).length

        setStats([
          { value: total.toString().padStart(2, "0"), label: "Total Projects" },
          { value: completed.toString().padStart(2, "0"), label: "Completed" },
          { value: ongoing.toString().padStart(2, "0"), label: "Ongoing" },
          { value: upcoming.toString().padStart(2, "0"), label: "Upcoming" },
        ])
      } catch (error) {
        console.error("Error fetching all projects:", error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadAllProjects()
  }, [])

  return (
    <main className="min-h-screen relative">
      <Header />
      <Services
        offeringType="lease"
        backgroundImage="/images_pages/services lease.png"
        stats={stats}
        filterButtons={["LUXURY", "COMMERCIAL", "INDUSTRIAL"]}
        // For all-projects, we don't force a specific category/luxury flag;
        // Services will treat these as generic projects.
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

