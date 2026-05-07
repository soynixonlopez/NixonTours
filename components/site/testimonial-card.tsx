"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialCard({
  quote,
  author,
  location,
  delay = 0,
}: {
  quote: string;
  author: string;
  location: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Card className="h-full border-slate-200/80 bg-white/80 backdrop-blur">
        <CardContent className="space-y-4 pt-6">
          <Quote className="h-8 w-8 text-cyan-500/80" aria-hidden />
          <p className="text-sm leading-relaxed text-[#475569]">{quote}</p>
          <div>
            <p className="text-sm font-semibold text-[#0f172a]">{author}</p>
            <p className="text-xs text-slate-500">{location}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
