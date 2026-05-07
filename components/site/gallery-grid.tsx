"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { IslandRow } from "@/types/database";
import { parseGallery } from "@/types/database";

export function GalleryGrid({
  islands,
  groupByIsland = true,
}: {
  islands: IslandRow[];
  groupByIsland?: boolean;
}) {
  const groups = islands.map((island) => {
    const urls = [
      ...(island.main_image_url ? [island.main_image_url] : []),
      ...parseGallery(island.gallery),
    ].filter(Boolean) as string[];
    return { island, urls: urls.slice(0, 8) };
  });

  if (!groupByIsland) {
    const flat = groups.flatMap((g) => g.urls);
    return (
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
        {flat.map((url, i) => (
          <motion.div
            key={`${url}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 8) * 0.03 }}
            className="mb-3 break-inside-avoid overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[4/3]">
              <Image src={url} alt="Galería Guna Yala" fill className="object-cover" sizes="400px" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {groups.map(({ island, urls }) => (
        <div key={island.id}>
          <h3 className="font-display text-xl font-bold text-brand-deep">{island.name}</h3>
          <div className="mt-4 columns-1 gap-3 sm:columns-2 lg:columns-3">
            {urls.map((url, i) => (
              <motion.div
                key={`${island.id}-${url}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-3 break-inside-avoid overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={url} alt={`${island.name} — Guna Yala`} fill className="object-cover" sizes="400px" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
