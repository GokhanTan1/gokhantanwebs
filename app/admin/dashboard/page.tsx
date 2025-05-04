'use client'

import { useEffect, useState } from 'react'
import { formatUrl } from '@/lib/utils'
import Image from 'next/image'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExperienceData {
  description: string
  experiences: {
    id: string
    title: string
    company: string
    period: string
    description: string
    skills: string[]
  }[]
}

interface AboutData {
  personalInfo: {
    name: string
    title: string
    location: string
    email: string
    phone: string
    linkedin: string
    description: string
  }
  skills: {
    technicalPrograms: string[]
    technicalCompetencies: string[]
    softSkills: string[]
  }
  education: {
    degree: string
    school: string
    years: string
    details: string[]
  }[]
}

interface ProfileData {
  title: string
  subtitle: string
  description: string
  education: string
  experience: string
  projects: string
  githubUrl: string
  linkedinUrl: string
  email: string
  profilePhoto: string
}

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  tags: string[]
  objectives: string[]
  technologies: string[]
  results: string[]
  link?: string
  githubLink?: string
}

interface ProjectsData {
  projects: Project[]
}

interface ContactData {
  email: string
  phone: string
  location: string
  description: string
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('profile')
  
  const [experienceData, setExperienceData] = useState<ExperienceData>({
    description: '',
    experiences: []
  })

  const [selectedExperience, setSelectedExperience] = useState<ExperienceData['experiences'][0] | null>(null)

  
  const [aboutData, setAboutData] = useState<AboutData>({
    personalInfo: {
      name: '',
      title: '',
      location: '',
      email: '',
      phone: '',
      linkedin: '',
      description: ''
    },
    skills: {
      technicalPrograms: [],
      technicalCompetencies: [],
      softSkills: []
    },
    education: [{
      degree: '',
      school: '',
      years: '',
      details: []
    }]
  })

  const [profileData, setProfileData] = useState<ProfileData>({
    title: '',
    subtitle: '',
    description: '',
    education: '',
    experience: '',
    projects: '',
    githubUrl: '',
    linkedinUrl: '',
    email: '',
    profilePhoto: '/profile-photo.jpg'
  })

  const [projectsData, setProjectsData] = useState<ProjectsData>({
    projects: []
  })

  const [contactData, setContactData] = useState<ContactData>({
    email: '',
    phone: '',
    location: '',
    description: ''
  })

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleAboutSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      })

      if (!response.ok) {
        throw new Error('Hakkımda sayfası güncellenirken bir hata oluştu')
      }

      toast({
        title: "Başarılı!",
        description: "Hakkımda sayfası güncellendi.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Hakkımda sayfası güncellenirken bir hata oluştu.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddEducation = () => {
    setAboutData({
      ...aboutData,
      education: [...aboutData.education, {
        degree: '',
        school: '',
        years: '',
        details: []
      }]
    })
  }

  const handleRemoveEducation = (index: number) => {
    setAboutData({
      ...aboutData,
      education: aboutData.education.filter((_, i) => i !== index)
    })
  }

  const handleUpdateEducationDetails = (index: number, details: string[]) => {
    const newEducation = [...aboutData.education]
    newEducation[index] = { ...newEducation[index], details }
    setAboutData({
      ...aboutData,
      education: newEducation
    })
  }

  const handleExperienceSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
      })

      if (!response.ok) {
        throw new Error('Deneyim bilgileri güncellenirken bir hata oluştu')
      }

      toast({
        title: "Başarılı!",
        description: "Deneyim bilgileri güncellendi.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Deneyim bilgileri güncellenirken bir hata oluştu.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      period: '',
      description: '',
      skills: []
    }

    setExperienceData({
      ...experienceData,
      experiences: [...experienceData.experiences, newExperience]
    })
    setSelectedExperience(newExperience)
  }

  const handleRemoveExperience = (id: string) => {
    setExperienceData({
      ...experienceData,
      experiences: experienceData.experiences.filter(exp => exp.id !== id)
    })
    setSelectedExperience(null)
  }

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })

      if (!response.ok) {
        throw new Error('İletişim bilgileri güncellenirken bir hata oluştu')
      }

      toast({
        title: "Başarılı!",
        description: "İletişim bilgileri güncellendi.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "İletişim bilgileri güncellenirken bir hata oluştu.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        // Profil verilerini yükle
        const profileResponse = await fetch('/api/admin/profile')
        if (profileResponse.ok) {
          const data = await profileResponse.json()
          if (data.success && data.data) {
            setProfileData(data.data)
          }
        }

        // Proje verilerini yükle
        const projectsResponse = await fetch('/api/admin/projects')
        if (projectsResponse.ok) {
          const data = await projectsResponse.json()
          if (data.success && data.data) {
            setProjectsData(data.data)
          }
        }

        // Hakkımda verilerini yükle
        const aboutResponse = await fetch('/api/admin/about')
        if (aboutResponse.ok) {
          const data = await aboutResponse.json()
          if (data.success && data.data) {
            setAboutData(data.data)
          }
        }

        // Deneyim verilerini yükle
        const experienceResponse = await fetch('/api/admin/experience')
        if (experienceResponse.ok) {
          const data = await experienceResponse.json()
          if (data.success && data.data) {
            setExperienceData(data.data)
          }
        }

        // İletişim verilerini yükle
        const contactResponse = await fetch('/api/admin/contact')
        if (contactResponse.ok) {
          const data = await contactResponse.json()
          if (data.success && data.data) {
            setContactData(data.data)
          }
        }
      } catch (error) {
        router.push('/admin/login')
      }
    }

    loadData()
  }, [router])

  const handleFileUpload = async (file: File, type: 'image' | 'document' | 'profile') => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Lütfen bir dosya seçin.",
      })
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Dosya yüklenirken bir hata oluştu')
      }

      const result = await response.json()
      
      if (!result.success || !result.path) {
        throw new Error('Dosya yükleme başarısız oldu: Geçersiz sunucu yanıtı')
      }

      if (type === 'profile') {
        setProfileData({
          ...profileData,
          profilePhoto: result.path
        })
      } else if (type === 'image') {
        if (selectedProject) {
          setSelectedProject({
            ...selectedProject,
            image: result.path
          })
          // Projeyi otomatik olarak güncelle
          const updatedProject = {
            ...selectedProject,
            image: result.path
          }
          handleUpdateProject(updatedProject)
        }
      } else {
        setSelectedProject({
          ...selectedProject!,
          link: result.path
        })
      }

      toast({
        title: "Başarılı!",
        description: "Dosya yüklendi.",
      })
    } catch (error: any) {
      console.error('Dosya yükleme hatası:', error)
      const errorDetails = error.response ? await error.response.json() : null
      const errorMessage = errorDetails?.error || error.message || "Dosya yüklenirken bir hata oluştu."
      
      toast({
        variant: "destructive",
        title: "Hata!",
        description: errorMessage,
      })

      if (errorDetails?.details) {
        console.error('Hata detayları:', errorDetails.details)
      }
      
      return null
    }
  }

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "Yeni Proje",
      description: "",
      longDescription: "",
      image: "/placeholder.jpg",
      tags: [],
      objectives: [],
      technologies: [],
      results: []
    }
    setProjectsData({
      projects: [...projectsData.projects, newProject]
    })
    setSelectedProject(newProject)
  }

  const handleUpdateProject = async (project: Project) => {
    const updatedProjects = projectsData.projects.map(p =>
      p.id === project.id ? project : p
    )
    
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: updatedProjects }),
      })

      if (response.ok) {
        setProjectsData({ projects: updatedProjects })
        toast({
          title: "Başarılı!",
          description: "Proje güncellendi.",
        })
      } else {
        throw new Error('Proje güncellenirken hata oluştu')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Proje güncellenirken bir hata oluştu.",
      })
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    const updatedProjects = projectsData.projects.filter(p => p.id !== projectId)
    
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: updatedProjects }),
      })

      if (response.ok) {
        setProjectsData({ projects: updatedProjects })
        setSelectedProject(null)
        toast({
          title: "Başarılı!",
          description: "Proje silindi.",
        })
      } else {
        throw new Error('Proje silinirken hata oluştu')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Proje silinirken bir hata oluştu.",
      })
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/profile')
        if (!response.ok) {
          router.push('/admin/login')
          return
        }
        
        const data = await response.json()
        if (data.success && data.data) {
          setProfileData(data.data)
        }
      } catch (error) {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error('Profil güncellenirken bir hata oluştu')
      }

      toast({
        title: "Başarılı!",
        description: "Profil bilgileri güncellendi.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Profil güncellenirken bir hata oluştu.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="projects">Projeler</TabsTrigger>
          <TabsTrigger value="about">Hakkımda</TabsTrigger>
          <TabsTrigger value="experience">Deneyim</TabsTrigger>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bilgilerini Düzenle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="profilePhoto">Profil Fotoğrafı</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 overflow-hidden rounded-full">
                      <Image
                        src={profileData.profilePhoto || "/profile-photo.jpg"}
                        alt="Profil Fotoğrafı"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          await handleFileUpload(e.target.files[0], 'profile')
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="title">Başlık</label>
                  <Input
                    id="title"
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subtitle">Alt Başlık</label>
                  <Input
                    id="subtitle"
                    value={profileData.subtitle}
                    onChange={(e) => setProfileData({ ...profileData, subtitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description">Açıklama</label>
                  <Textarea
                    id="description"
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="education">Eğitim</label>
                  <Input
                    id="education"
                    value={profileData.education}
                    onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="experience">Deneyim</label>
                  <Input
                    id="experience"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="githubUrl">GitHub URL</label>
                  <Input
                    id="githubUrl"
                    value={profileData.githubUrl}
                    onChange={(e) => setProfileData({ ...profileData, githubUrl: formatUrl(e.target.value) })}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="linkedinUrl">LinkedIn URL</label>
                  <Input
                    id="linkedinUrl"
                    value={profileData.linkedinUrl}
                    onChange={(e) => setProfileData({ ...profileData, linkedinUrl: formatUrl(e.target.value) })}
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email">E-posta</label>
                  <Input
                    id="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Güncelleniyor..." : "Güncelle"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Hakkımda Sayfasını Düzenle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAboutSubmit} className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Kişisel Bilgiler</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label>İsim Soyisim</label>
                      <Input
                        value={aboutData.personalInfo.name}
                        onChange={(e) => setAboutData({
                          ...aboutData,
                          personalInfo: { ...aboutData.personalInfo, name: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Ünvan</label>
                      <Input
                        value={aboutData.personalInfo.title}
                        onChange={(e) => setAboutData({
                          ...aboutData,
                          personalInfo: { ...aboutData.personalInfo, title: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label>E-posta</label>
                      <Input
                        value={aboutData.personalInfo.email}
                        onChange={(e) => setAboutData({
                          ...aboutData,
                          personalInfo: { ...aboutData.personalInfo, email: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Telefon</label>
                      <Input
                        value={aboutData.personalInfo.phone}
                        onChange={(e) => setAboutData({
                          ...aboutData,
                          personalInfo: { ...aboutData.personalInfo, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Konum</label>
                      <Input
                        value={aboutData.personalInfo.location}
                        onChange={(e) => setAboutData({
                          ...aboutData,
                          personalInfo: { ...aboutData.personalInfo, location: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label>LinkedIn</label>
                      <Input
                        value={aboutData.personalInfo.linkedin}
                        onChange={(e) => setAboutData({
                          ...aboutData,
                          personalInfo: { ...aboutData.personalInfo, linkedin: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label>Hakkımda</label>
                    <Textarea
                      value={aboutData.personalInfo.description}
                      onChange={(e) => setAboutData({
                        ...aboutData,
                        personalInfo: { ...aboutData.personalInfo, description: e.target.value }
                      })}
                      rows={10}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Yetenekler</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label>Teknik Programlar (her satıra bir program)</label>
                      <Textarea
                        value={aboutData.skills.technicalPrograms.join('\n')}
                        onChange={(e) => setAboutData({
                          ...aboutData,
                          skills: {
                            ...aboutData.skills,
                            technicalPrograms: e.target.value.split('\n').filter(p => p.trim())
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Teknik Yeterlilikler (her satıra bir yeterlilik)</label>
                      <Textarea
                        value={aboutData.skills.technicalCompetencies.join('\n')}
                        onChange={(e) => setAboutData({
                          ...aboutData,
                          skills: {
                            ...aboutData.skills,
                            technicalCompetencies: e.target.value.split('\n').filter(c => c.trim())
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Kişisel Beceriler (her satıra bir beceri)</label>
                      <Textarea
                        value={aboutData.skills.softSkills.join('\n')}
                        onChange={(e) => setAboutData({
                          ...aboutData,
                          skills: {
                            ...aboutData.skills,
                            softSkills: e.target.value.split('\n').filter(s => s.trim())
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Eğitim Geçmişi</h3>
                  <div className="space-y-4">
                    {aboutData.education.map((edu, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded">
                        <div className="grid grid-cols-3 gap-4">
                          <Input
                            placeholder="Okul"
                            value={edu.school}
                            onChange={(e) => {
                              const newEducation = [...aboutData.education]
                              newEducation[index] = { ...edu, school: e.target.value }
                              setAboutData({ ...aboutData, education: newEducation })
                            }}
                          />
                          <Input
                            placeholder="Bölüm"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEducation = [...aboutData.education]
                              newEducation[index] = { ...edu, degree: e.target.value }
                              setAboutData({ ...aboutData, education: newEducation })
                            }}
                          />
                          <Input
                            placeholder="Yıllar"
                            value={edu.years}
                            onChange={(e) => {
                              const newEducation = [...aboutData.education]
                              newEducation[index] = { ...edu, years: e.target.value }
                              setAboutData({ ...aboutData, education: newEducation })
                            }}
                          />
                        </div>
                        <Textarea
                          placeholder="Detaylar (her satıra bir madde)"
                          value={edu.details.join('\n')}
                          onChange={(e) => {
                            const newEducation = [...aboutData.education]
                            newEducation[index] = {
                              ...edu,
                              details: e.target.value.split('\n').filter(d => d.trim())
                            }
                            setAboutData({ ...aboutData, education: newEducation })
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleRemoveEducation(index)}
                        >
                          Eğitimi Sil
                        </Button>
                      </div>
                    ))}
                    <Button type="button" onClick={handleAddEducation}>
                      + Yeni Eğitim Ekle
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Projeler</CardTitle>
              <Button onClick={handleAddProject}>Yeni Proje Ekle</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  {projectsData.projects.map((project) => (
                    <Card key={project.id} className="cursor-pointer" onClick={() => setSelectedProject(project)}>
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{project.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {selectedProject && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="projectTitle">Proje Başlığı</label>
                      <Input
                        id="projectTitle"
                        value={selectedProject.title}
                        onChange={(e) => setSelectedProject({
                          ...selectedProject,
                          title: e.target.value
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="projectDescription">Kısa Açıklama</label>
                      <Input
                        id="projectDescription"
                        value={selectedProject.description}
                        onChange={(e) => setSelectedProject({
                          ...selectedProject,
                          description: e.target.value
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="projectLongDescription">Detaylı Açıklama</label>
                      <Textarea
                        id="projectLongDescription"
                        value={selectedProject.longDescription}
                        onChange={(e) => setSelectedProject({
                          ...selectedProject,
                          longDescription: e.target.value
                        })}
                      />
                    </div>

                    <div className="space-y-4">
                      <label>Proje Görseli</label>
                      <div className="flex flex-col space-y-4">
                        <div className="relative w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors">
                          {selectedProject.image ? (
                            <>
                              <Image
                                src={selectedProject.image}
                                alt="Proje görseli"
                                fill
                                className="object-contain"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white">Görseli değiştirmek için tıklayın</p>
                              </div>
                            </>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <p className="text-gray-500">Görsel yüklemek için tıklayın</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleFileUpload(file, 'image')
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          PNG, JPG veya WebP formatında bir görsel yükleyin.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="projectTags">Etiketler (virgülle ayırın)</label>
                      <Input
                        id="projectTags"
                        value={selectedProject.tags.join(', ')}
                        onChange={(e) => setSelectedProject({
                          ...selectedProject,
                          tags: e.target.value.split(',').map(tag => tag.trim())
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="projectObjectives">Hedefler (virgülle ayırın)</label>
                      <Textarea
                        id="projectObjectives"
                        value={selectedProject.objectives.join('\n')}
                        onChange={(e) => setSelectedProject({
                          ...selectedProject,
                          objectives: e.target.value.split('\n').filter(obj => obj.trim())
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="projectTechnologies">Teknolojiler (virgülle ayırın)</label>
                      <Textarea
                        id="projectTechnologies"
                        value={selectedProject.technologies.join('\n')}
                        onChange={(e) => setSelectedProject({
                          ...selectedProject,
                          technologies: e.target.value.split('\n').filter(tech => tech.trim())
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="projectResults">Sonuçlar (virgülle ayırın)</label>
                      <Textarea
                        id="projectResults"
                        value={selectedProject.results.join('\n')}
                        onChange={(e) => setSelectedProject({
                          ...selectedProject,
                          results: e.target.value.split('\n').filter(result => result.trim())
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="projectGithubLink">GitHub Linki (opsiyonel)</label>
                      <Input
                        id="projectGithubLink"
                        value={selectedProject.githubLink || ''}
                        onChange={(e) => setSelectedProject({
                          ...selectedProject,
                          githubLink: e.target.value
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label>Proje Dosyası (PDF)</label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'document')
                          }}
                        />
                        {selectedProject.link && (
                          <a
                            href={selectedProject.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Mevcut PDF
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => handleUpdateProject(selectedProject)}
                      >
                        Güncelle
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteProject(selectedProject.id)}
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
       <TabsContent value="experience">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between">
             <CardTitle>Deneyim Bilgilerini Düzenle</CardTitle>
             <Button onClick={handleAddExperience}>Yeni Deneyim Ekle</Button>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleExperienceSubmit} className="space-y-6">
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label>Genel Açıklama</label>
                   <Textarea
                     value={experienceData.description}
                     onChange={(e) => setExperienceData({
                       ...experienceData,
                       description: e.target.value
                     })}
                     rows={3}
                   />
                 </div>

                 <div className="space-y-4">
                   <h3 className="text-lg font-medium">Deneyimler</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       {experienceData.experiences.map((experience) => (
                         <Card
                           key={experience.id}
                           className="cursor-pointer"
                           onClick={() => setSelectedExperience(experience)}
                         >
                           <CardHeader>
                             <CardTitle>{experience.title || 'Yeni Deneyim'}</CardTitle>
                           </CardHeader>
                           <CardContent>
                             <p className="text-sm text-muted-foreground">{experience.company}</p>
                           </CardContent>
                         </Card>
                       ))}
                     </div>

                     {selectedExperience && (
                       <div className="space-y-4">
                         <div className="space-y-2">
                           <label>Pozisyon</label>
                           <Input
                             value={selectedExperience.title}
                             onChange={(e) => {
                               setSelectedExperience({
                                 ...selectedExperience,
                                 title: e.target.value
                               })
                               setExperienceData({
                                 ...experienceData,
                                 experiences: experienceData.experiences.map(exp =>
                                   exp.id === selectedExperience.id ? { ...exp, title: e.target.value } : exp
                                 )
                               })
                             }}
                           />
                         </div>

                         <div className="space-y-2">
                           <label>Kurum/Şirket</label>
                           <Input
                             value={selectedExperience.company}
                             onChange={(e) => {
                               setSelectedExperience({
                                 ...selectedExperience,
                                 company: e.target.value
                               })
                               setExperienceData({
                                 ...experienceData,
                                 experiences: experienceData.experiences.map(exp =>
                                   exp.id === selectedExperience.id ? { ...exp, company: e.target.value } : exp
                                 )
                               })
                             }}
                           />
                         </div>

                         <div className="space-y-2">
                           <label>Dönem</label>
                           <Input
                             value={selectedExperience.period}
                             onChange={(e) => {
                               setSelectedExperience({
                                 ...selectedExperience,
                                 period: e.target.value
                               })
                               setExperienceData({
                                 ...experienceData,
                                 experiences: experienceData.experiences.map(exp =>
                                   exp.id === selectedExperience.id ? { ...exp, period: e.target.value } : exp
                                 )
                               })
                             }}
                           />
                         </div>

                         <div className="space-y-2">
                           <label>Açıklama</label>
                           <Textarea
                             value={selectedExperience.description}
                             onChange={(e) => {
                               setSelectedExperience({
                                 ...selectedExperience,
                                 description: e.target.value
                               })
                               setExperienceData({
                                 ...experienceData,
                                 experiences: experienceData.experiences.map(exp =>
                                   exp.id === selectedExperience.id ? { ...exp, description: e.target.value } : exp
                                 )
                               })
                             }}
                             rows={4}
                           />
                         </div>

                         <div className="space-y-2">
                           <label>Yetenekler (her satıra bir yetenek)</label>
                           <Textarea
                             value={selectedExperience.skills.join('\n')}
                             onChange={(e) => {
                               const skills = e.target.value.split('\n').filter(skill => skill.trim())
                               setSelectedExperience({
                                 ...selectedExperience,
                                 skills
                               })
                               setExperienceData({
                                 ...experienceData,
                                 experiences: experienceData.experiences.map(exp =>
                                   exp.id === selectedExperience.id ? { ...exp, skills } : exp
                                 )
                               })
                             }}
                             rows={4}
                           />
                         </div>

                         <Button
                           type="button"
                           variant="destructive"
                           onClick={() => handleRemoveExperience(selectedExperience.id)}
                         >
                           Deneyimi Sil
                         </Button>
                       </div>
                     )}
                   </div>
                 </div>
               </div>

               <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
               </Button>
             </form>
           </CardContent>
         </Card>
       </TabsContent>

       <TabsContent value="contact">
         <Card>
           <CardHeader>
             <CardTitle>İletişim Bilgilerini Düzenle</CardTitle>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleContactSubmit} className="space-y-4">
               <div className="space-y-2">
                 <label htmlFor="email">E-posta</label>
                 <Input
                   id="email"
                   type="email"
                   value={contactData.email}
                   onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                 />
               </div>

               <div className="space-y-2">
                 <label htmlFor="phone">Telefon</label>
                 <Input
                   id="phone"
                   value={contactData.phone}
                   onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                 />
               </div>

               <div className="space-y-2">
                 <label htmlFor="location">Konum</label>
                 <Input
                   id="location"
                   value={contactData.location}
                   onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                 />
               </div>

               <div className="space-y-2">
                 <label htmlFor="contact-description">Açıklama</label>
                 <Textarea
                   id="contact-description"
                   value={contactData.description}
                   onChange={(e) => setContactData({ ...contactData, description: e.target.value })}
                 />
               </div>

               <Button type="submit" disabled={isLoading}>
                 {isLoading ? "Kaydediliyor..." : "Kaydet"}
               </Button>
             </form>
           </CardContent>
         </Card>
       </TabsContent>
     </Tabs>
   </main>
  )
}