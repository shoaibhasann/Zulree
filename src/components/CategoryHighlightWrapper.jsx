"use client";

import React, { useEffect } from 'react'
import SectionIntro from './SectionIntro'
import CategoryHighlightSection from './CategoryHightlightSection'

export default function CategoryHighlightWrapper() {

  return (
    <div className="block pb-10 md:pb-14">
      <div className="flex flex-col">
        <SectionIntro
          title="Minimal Bracelets"
          subtitle="Subtle statements that elevate every moment"
        />
        <CategoryHighlightSection category="Bracelets" />
      </div>
      <div className="flex flex-col">
        <SectionIntro
          title="Trending Earrings"
          subtitle="Refined designs loved by the new generation"
        />
        <CategoryHighlightSection category="Earrings" />
      </div>
      <div className="flex flex-col">
        <SectionIntro
          title="Signature Necklaces"
          subtitle="Designed to sit perfectly, styled to stand out"
        />
        <CategoryHighlightSection category="Necklaces" />
      </div>
     
      
      <div className="flex flex-col">
        <SectionIntro
          title="Statement Rings"
          subtitle="Bold forms with refined finishing"
        />
        <CategoryHighlightSection category="Rings" />
      </div>

    </div>
  );
}
