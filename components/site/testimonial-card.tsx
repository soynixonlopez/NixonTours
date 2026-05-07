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
      <Card className="h-full border-brand-deep/10 bg-brand-pearl/90 backdrop-blur-sm">
        <CardContent className="space-y-4 pt-6">
          <Quote className="h-8 w-8 text-brand-sunset" aria-hidden />
          <p className="text-sm leading-relaxed text-slate-600">{quote}</p>
          <div>
            <p className="text-sm font-semibold text-brand-deep font-display">
              {author}
            </p>
            <p className="text-xs text-slate-500">{location}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
