"use client"

import { motion } from "framer-motion"

const projects = [
  {
    id: 0,
    title: "Interactive Quotes",
    category: "Web Design",
    year: "2025",
    description:
      "A visually captivating quotes platform with dynamic colors and refined typography. Users explore curated collections through intuitive interactions.",
    link: "https://reveriee.vercel.app",
  },
  {
    id: 1,
    title: "mini v0 - with tabs",
    category: "Web Development",
    year: "2025",
    description:
      "An experimental reimagining of v0's interface with tabbed navigation. Explores cleaner workflows for seamless project switching and organization.",
    link: "https://v0-mini-v0-with-tabs.vercel.app/",
  },
  {
    id: 2,
    title: "Pixel Soccer",
    category: "Game Development",
    year: "2025",
    description:
      "A nostalgic pixel-art soccer game with intuitive controls and dynamic gameplay. Features charming retro aesthetics from the golden age of gaming.",
    link: "https://pixel-soccer.vercel.app",
  },
  {
    id: 3,
    title: "Caged Bird",
    category: "Web App",
    year: "2025",
    description:
      "A narrative puzzle experience with minimalist aesthetics and challenging gameplay. Players solve increasingly complex riddles to progress through a touching story of freedom.",
    link: "https://cagedbird.vercel.app",
  },
  {
    id: 4,
    title: "WordLadderWar",
    category: "Game Development",
    year: "2025",
    description:
      "A fast-paced word transformation game with real-time multiplayer and custom dictionaries. Features an elegant interface that makes wordplay addictive.",
    link: "https://word-ladder-war.vercel.app/",
  },
]

export function WorkSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  return (
    <section id="work" className="section-spacing">
      <div className="container-xl">
        <motion.h2
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="section-title mb-24"
        >
          Selected Work
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block py-8 border-t border-foreground/10 transition-all duration-500 ease-out"
              >
                <div className="flex items-center justify-between">
                  <h3 className="project-title text-foreground/80 group-hover:text-foreground transition-colors duration-500 ease-out">
                    {project.title}
                  </h3>
                  <div className="meta-text text-foreground-secondary">{project.year}</div>
                </div>

                {/* Project description that appears on hover */}
                <div className="max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 ease-out">
                  <p className="project-description text-foreground-secondary max-w-2xl pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 ease-out">
                    {project.description}
                  </p>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
