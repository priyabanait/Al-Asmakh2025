'use client'

import { useState, useEffect } from 'react'
import Header from '../../../components/Header'
import Services from '../../../components/Services-lease'
import Footer from '../../../components/Footer'
import { fetchProjectsByStatus } from '../../../utils/projectapi'

export default function UpcomingPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { value: "0", label: "Total Projects" },
    { value: "0", label: "Completed" },
    { value: "0", label: "Ongoing" },
    { value: "0", label: "Upcoming" },
  ])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        // Fetch projects with projectStatus: off-plan, under-construction, under-maintenance
        const fetchedProjects = await fetchProjectsByStatus(
          ["off-plan", "under-construction", "under-maintenance"],
          {
            page: 1,
            limit: 100, // Get more projects to filter properly
            status: "active",
          }
        )

        setProjects(fetchedProjects)

        // Calculate stats from projects
        const total = fetchedProjects.length
        const completed = fetchedProjects.filter(p => p.statusType === "completed").length
        const ongoing = fetchedProjects.filter(p => p.statusType === "ongoing").length
        const upcoming = fetchedProjects.filter(p => p.statusType === "upcoming" || (!p.statusType || p.statusType === "")).length

        setStats([
          { value: total.toString().padStart(2, "0"), label: "Total Projects" },
          { value: completed.toString().padStart(2, "0"), label: "Completed" },
          { value: ongoing.toString().padStart(2, "0"), label: "Ongoing" },
          { value: upcoming.toString().padStart(2, "0"), label: "Upcoming" },
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
        category="upcoming"
        projects={projects}
        loading={loading}
        useProjects={true}
      />
      <Footer />
    </main>
  )
}

