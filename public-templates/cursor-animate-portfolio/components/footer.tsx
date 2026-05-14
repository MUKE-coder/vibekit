"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export function Footer() {
  const [showSpotifyEmbed, setShowSpotifyEmbed] = useState(false)

  return (
    <motion.footer
      className="py-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
    >
      <div className="container-xl">
        <div className="flex flex-col md:flex-row justify-center items-center text-center">
          <p className="meta-text text-foreground-secondary flex items-center gap-2">
            Built with love and music by{" "}
            <a
              href="https://x.com/damilare_oo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              Damilare
            </a>{" "}
            <a
              href="https://open.spotify.com/playlist/2WqAscMqGj6fGkjaYN9jsY?si=74ddec964be94dca"
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-white hover:text-foreground/80 transition-colors"
              aria-label="Spotify Playlist"
              onMouseEnter={() => setShowSpotifyEmbed(true)}
              onMouseLeave={() => setShowSpotifyEmbed(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>

              {/* Spotify Embed Card with Smooth Animations */}
              <AnimatePresence>
                {showSpotifyEmbed && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                      y: 10,
                      filter: "blur(4px)",
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      y: 5,
                      filter: "blur(2px)",
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1.0],
                      scale: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      },
                    }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-50 bg-[#121212] rounded-lg shadow-2xl border border-[#282828] overflow-hidden"
                  >
                    <motion.div
                      className="w-80 sm:w-96 h-80 sm:h-96"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                    >
                      <iframe
                        src="https://open.spotify.com/embed/playlist/2WqAscMqGj6fGkjaYN9jsY?utm_source=generator&theme=0"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-lg"
                      />
                    </motion.div>
                    {/* Animated Arrow pointing down */}
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ delay: 0.15, duration: 0.2 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#282828]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
