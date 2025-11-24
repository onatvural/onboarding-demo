"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { FlipWords } from "@/components/ui/flip-words"

const loadingMessages = [
  "Risk profilinizi analiz ediyoruz...",
  "Fonları karşılaştırıyoruz...",
  "Önerilerinizi hazırlıyoruz...",
]

export function LoadingCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <Card className="w-full max-w-2xl border-border/40 bg-card/60 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center min-h-[140px] p-8">
          <FlipWords
            words={loadingMessages}
            duration={2000}
            className="text-xl font-light text-foreground text-center"
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
