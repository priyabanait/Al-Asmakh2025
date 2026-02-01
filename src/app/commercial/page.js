'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Services from '../../components/Services-lease'
import Footer from '../../components/Footer'
import { fetchProjectsByType } from '../../utils/projectapi'

export default function CommercialPage() {
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
        // Fetch projects with projectType "Commercial"
        const fetchedProjects = await fetchProjectsByType("Commercial", {
          page: 1,
          limit: 100,
          status: "active",
        })

        console.log("Commercial page - fetched projects:", {
            count: fetchedProjects.length,
            projects: fetchedProjects,
        });

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
        offeringType="commercial"
        backgroundImage="/images_pages/services lease.png"
        stats={stats}
        filterButtons={["LUXURY", "COMMERCIAL", "INDUSTRIAL"]}
        projects={projects}
        loading={loading}
        useProjects={true}
      />
      <Footer />
    </main>
  )
}

