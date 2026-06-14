"use client";

import React, { useEffect, useState } from "react";

type Props = {
  svg?: string; // raw svg string (preferred)
  src?: string; // url to fetch (public/)
  width?: number;
  height?: number;
  size?: number;
  color?: string; // color to embed or omit to use "currentColor"
  className?: string;
  alt?: string;
  fixColor?: boolean;
};

/**
 * @brief for get svg and modify it but it so slow af
 * @param size if want completely squre, if want retangle just use width and height
 * @param color for fixing color icon. can't change
 * @returns <svg className={className} {...svgProps} dangerouslySetInnerHTML={{ __html: svgInner }}
    />
 */
export default function IconSvgMono({
  svg,
  src,
  width = 24,
  height = 24,
  size,
  color,
  className,
  alt,
  fixColor = false,
}: Props) {
  const [svgInner, setSvgInner] = useState<string | null>(null);
  const [svgAttrs, setSvgAttrs] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function process(raw: string) {
      // strip xml prolog
      let s = raw.replace(/<\?xml.*?\?>\s*/g, "");

      // default color = currentColor to allow CSS inheritance
      const finalColor = color ?? "currentColor";
      if (!fixColor) {
        s = s.replace(/fill="(?!none)[^"]*"/gi, `fill="${finalColor}"`);
        s = s.replace(/stroke="(?!none)[^"]*"/gi, `stroke="${finalColor}"`);
      }

      // extract <svg ...attrs...>inner</svg>
      const m = s.match(/<svg([^>]*)>([\s\S]*?)<\/svg>/i);
      let attrsText = "";
      let inner = s;
      if (m) {
        attrsText = m[1] || "";
        inner = m[2] || "";
      }

      // parse attributes into object (simple parser)
      const attrs: Record<string, string> = {};
      attrsText.replace(/([^\s=]+)\s*=\s*"([^"]*)"/g, (_, k, v) => {
        attrs[k] = v;
        return "";
      });

      // override width/height with props (size preferred)
      const finalSize = size ?? undefined;
      if (finalSize) {
        attrs.width = String(finalSize);
        attrs.height = String(finalSize);
      } else {
        attrs.width = String(width);
        attrs.height = String(height);
      }

      if (!cancelled) {
        setSvgInner(inner);
        setSvgAttrs(attrs);
      }
    }

    (async () => {
      try {
        if (svg) {
          await process(svg);
        } else if (src) {
          const res = await fetch(src);
          if (!res.ok) {
            console.warn("Failed to fetch svg:", src, res.status);
            return;
          }
          const text = await res.text();
          await process(text);
        } else {
          setSvgInner(null);
          setSvgAttrs({});
        }
      } catch (e) {
        console.warn("Error processing svg:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [svg, src, width, height, size, color]);

  if (!svgInner) return null;

  // Build attribute props for <svg>
  const svgProps: React.SVGProps<SVGSVGElement> = {};
  for (const k in svgAttrs) {
    // React uses camelCase for some props (viewBox stays viewBox)
    const propName = k === "viewbox" ? "viewBox" : k;
    // assign as unknown instead any
    (svgProps as unknown as Record<string, string>)[propName] = svgAttrs[k];
  }

  // ensure role/aria
  svgProps.role = "img";
  if (alt) svgProps["aria-label"] = alt;

  return (
    <svg
      className={className}
      {...svgProps}
      // insert children HTML inside svg
      dangerouslySetInnerHTML={{ __html: svgInner }}
    />
  );
}

export const addImageSvg_Dark = `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#prefix__clip0_4349_3815)">
        <path d="M16.875 3.125H3.125a1.25 1.25 0 00-1.25 1.25v11.25a1.25 1.25 0 001.25 1.25h13.75a1.25 1.25 0 001.25-1.25V4.375a1.25 1.25 0 00-1.25-1.25zm0 1.25v8.027l-2.037-2.036a1.25 1.25 0 00-1.768 0l-1.562 1.563L8.07 8.49a1.25 1.25 0 00-1.767 0L3.125 11.67V4.375h13.75zm-13.75 9.063l4.063-4.063 6.25 6.25H3.124v-2.188zm13.75 2.187h-1.67l-2.812-2.813 1.563-1.562 2.919 2.92v1.455zM11.25 7.812a.938.938 0 111.875 0 .938.938 0 01-1.875 0z" 
        fill="currentColor"/>
        <mask id="prefix__a" maskUnits="userSpaceOnUse" x="12.271" y=".5" width="9" height="9" fill="#000">
            <path fill="#" d="M12.271.5h9v9h-9z"/>
            <path d="M16.123 7.063V2.067h1.134v4.996h-1.134zm-1.931-1.931V3.998h4.996v1.134h-4.996z"/>
        </mask>
        <path d="M16.123 7.063V2.067h1.134v4.996h-1.134zm-1.931-1.931V3.998h4.996v1.134h-4.996z" fill="#fff"/>
        <path d="M16.123 7.063h-1.47v1.47h1.47v-1.47zm0-4.996V.597h-1.47v1.47h1.47zm1.134 0h1.47V.597h-1.47v1.47zm0 4.996v1.47h1.47v-1.47h-1.47zm-3.065-1.931h-1.47v1.47h1.47v-1.47zm0-1.134v-1.47h-1.47v1.47h1.47zm4.996 0h1.47v-1.47h-1.47v1.47zm0 1.134v1.47h1.47v-1.47h-1.47zm-3.065 1.931h1.47V2.067h-2.94v4.996h1.47zm0-4.996v1.47h1.134V.598h-1.134v1.47zm1.134 0h-1.47v4.996h2.94V2.067h-1.47zm0 4.996v-1.47h-1.134v2.94h1.134v-1.47zm-3.065-1.931h1.47V3.998h-2.94v1.134h1.47zm0-1.134V5.47h4.996V2.528h-4.996v1.47zm4.996 0h-1.47v1.134h2.94V3.998h-1.47zm0 1.134v-1.47h-4.996v2.94h4.996v-1.47z" 
        fill="#" mask="url(#prefix__a)"/>
    </g>
    <defs>
        <clipPath id="prefix__clip0_4349_3815">
            <path fill="#fff" d="M0 0h20v20H0z"/>
        </clipPath>
    </defs>
</svg>`;
