import { Calendar } from 'lucide-react';

interface WelcomeBannerProps {
  userName?: string;
}

export function WelcomeBanner({ userName = 'Sekhar' }: WelcomeBannerProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="animate-fade-in relative overflow-hidden rounded-2xl p-8 md:p-10">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700" />

      {/* Mesh / wave pattern decoration */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 150C200 80 400 220 600 150C800 80 1000 220 1200 150V300H0V150Z"
            fill="white"
          />
          <path
            d="M0 180C200 110 400 250 600 180C800 110 1000 250 1200 180V300H0V180Z"
            fill="white"
            opacity="0.5"
          />
          <path
            d="M0 210C200 140 400 280 600 210C800 140 1000 280 1200 210V300H0V210Z"
            fill="white"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-sm" />
      <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-sm" />
      <div className="absolute left-1/2 top-0 h-24 w-24 rounded-full bg-white/10 blur-md" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-blue-100/80 mb-3">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-blue-100/70 text-base md:text-lg max-w-xl">
          Here&apos;s what&apos;s happening with your projects today.
          You have <span className="text-white font-semibold">3 tasks</span> pending review.
        </p>
      </div>
    </div>
  );
}
