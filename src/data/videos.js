const videoPath = (filename) =>
  `/assets/video/${encodeURIComponent(filename)}`;

const allHomeVideos = [
  {
    id: "studio-showreel",
    title: "Studio",
    titleAccent: "Showreel",
    subtitle: "Behind the scenes",
    orientation: "landscape",
    src: videoPath("eeeeex.mp4"),
  },
  {
    id: "client-spotlight-may",
    title: "Client",
    titleAccent: "Spotlight",
    subtitle: "Digital marketing in action",
    orientation: "portrait",
    src: videoPath("WhatsApp Video 2026-05-22 at 12.19.31.mp4"),
  },
  {
    id: "brand-content-june",
    title: "Brand",
    titleAccent: "Content",
    subtitle: "Creative production",
    orientation: "landscape",
    src: videoPath("WhatsApp Video 2026-06-04 at 17.52.24.mp4"),
  },
  {
    id: "campaign-reel-1",
    title: "Campaign",
    titleAccent: "Reel",
    subtitle: "Social media & paid ads",
    orientation: "landscape",
    src: videoPath("WhatsApp Video 2026-06-11 at 13.53.50.mp4"),
  },
  {
    id: "creative-reel-2",
    title: "Creative",
    titleAccent: "Reel II",
    subtitle: "Campaign production",
    orientation: "landscape",
    src: videoPath("WhatsApp Video 2026-06-11 at 15.17.49 (1).mp4"),
  },
  {
    id: "creative-reel-3",
    title: "Creative",
    titleAccent: "Reel III",
    subtitle: "Campaign production",
    orientation: "landscape",
    src: videoPath("WhatsApp Video 2026-06-11 at 15.17.49 (2).mp4"),
  },
  {
    id: "creative-reel-4",
    title: "Creative",
    titleAccent: "Reel IV",
    subtitle: "Campaign production",
    orientation: "landscape",
    src: videoPath("WhatsApp Video 2026-06-11 at 15.17.49.mp4"),
  },
  {
    id: "production-reel-1",
    title: "Production",
    titleAccent: "Reel",
    subtitle: "Studio workflow",
    orientation: "landscape",
    src: videoPath("WhatsApp Video 2026-06-11 at 15.17.53 (1).mp4"),
  },
  {
    id: "production-reel-2",
    title: "Production",
    titleAccent: "Reel II",
    subtitle: "Studio workflow",
    orientation: "landscape",
    src: videoPath("WhatsApp Video 2026-06-11 at 15.17.53.mp4"),
  },
  {
    id: "social-reel-1",
    title: "Social",
    titleAccent: "Reel",
    subtitle: "Content for social channels",
    orientation: "landscape",
    src: videoPath("WhatsApp Video 2026-06-11 at 15.18.29.mp4"),
  },
  {
    id: "social-reel-2",
    title: "Social",
    titleAccent: "Reel II",
    subtitle: "Content for social channels",
    orientation: "landscape",
    src: videoPath("WhatsApp Video 2026-06-11 at 15.18.41.mp4"),
  },
  {
    id: "campaign-clip-1",
    title: "Campaign",
    titleAccent: "Clip",
    subtitle: "Paid media creative",
    orientation: "landscape",
    src: videoPath("WhatsApp Video 2026-06-11 at 15.19.39.mp4"),
  },
  {
    id: "behind-scenes-portrait",
    title: "Behind",
    titleAccent: "the Scenes",
    subtitle: "On-set moments",
    orientation: "portrait",
    src: videoPath("WhatsApp Video 2026-06-11 at 15.29.25.mp4"),
  },
];

export const allVideos = allHomeVideos;

export const homeVideos = allHomeVideos.filter(
  (video) => video.orientation === "landscape"
);
