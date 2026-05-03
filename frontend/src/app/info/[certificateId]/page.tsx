import Link from "next/link";
import { CertificateCard } from "@/components/certificate-card";
import { fetchCertificate } from "@/lib/api";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const record = await fetchCertificate(certificateId);

  if (!record) {
    return (
      // FIX 1: Enforced Light Mode and added the Light Red to Red Gradient background
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-red-200 to-red-500 p-4 sm:p-6 md:p-8 flex flex-col pt-12">
        <div className="max-w-5xl mx-auto w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-red-900/10 backdrop-blur-md">
            <div className="flex items-center gap-4 w-full justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="group flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 transition-all duration-300 bg-white/60 rounded-full hover:bg-white shadow-sm border border-white/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left w-5 h-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true">
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                  </svg>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/60 shadow-sm rounded-lg border border-red-100/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check w-6 h-6 text-red-600" aria-hidden="true">
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest leading-none mb-1">E-Verify Portal</span>
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-none">Information Access</h1>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-white/50 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check w-4 h-4 text-emerald-600" aria-hidden="true">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                <span className="text-xs font-bold text-slate-700">Verified by certitrust.lk</span>
              </div>
            </div>
          </div>

          {/* Invalid Record Card */}
          {/* FIX 2: Removed dark mode variants and enhanced glassmorphism for the red background */}
          <div className="flex flex-col items-center justify-center py-24 px-6 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-red-900/10 text-center space-y-8 relative overflow-hidden group">
            
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none"></div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-red-200 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              
              <div className="relative p-6 bg-gradient-to-b from-red-50 to-white border border-red-100 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-x w-16 h-16 text-red-500" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m15 9-6 6"></path>
                  <path d="m9 9 6 6"></path>
                </svg>
              </div>
            </div>
            
            <div className="space-y-4 max-w-md relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Record Not Found</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                The Verification ID <br />
                <span className="inline-block mt-2 px-4 py-1.5 bg-white border border-red-600 rounded-lg font-mono font-bold text-red-600 shadow-sm">
                  {certificateId}
                </span>
                <br />
                does not match any official record in our database.
              </p>
            </div>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive bg-black text-white hover:bg-gray-900 has-[>svg]:px-4 rounded-2xl px-8 h-14 text-base font-semibold shadow-xl hover:scale-105 transition-all duration-300 relative z-10" 
            >
              Try Another Number
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Valid record renders normally using the component you already have
  return (
    // Also ensuring light mode styling on the valid side just in case
    <main className="min-h-screen bg-slate-50 flex flex-col p-4 sm:p-6 md:p-8">
      <CertificateCard record={record} />
    </main>
  );
}