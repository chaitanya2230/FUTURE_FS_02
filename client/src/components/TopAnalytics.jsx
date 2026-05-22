import { Users, UserPlus, PhoneCall, CheckCircle } from 'lucide-react';

const TopAnalytics = ({ leads }) => {
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = totalLeads === 0 ? 0 : Math.round((convertedLeads / totalLeads) * 100);

  const stats = [
    { 
      name: 'Total Pipelines', 
      value: totalLeads, 
      icon: Users, 
      color: 'text-violet-400', 
      glow: 'shadow-violet-500/10',
      bg: 'bg-violet-500/5 border-violet-500/15' 
    },
    { 
      name: 'Unassigned/New', 
      value: newLeads, 
      icon: UserPlus, 
      color: 'text-cyan-400', 
      glow: 'shadow-cyan-500/10',
      bg: 'bg-cyan-500/5 border-cyan-500/15' 
    },
    { 
      name: 'Contacted Leads', 
      value: contactedLeads, 
      icon: PhoneCall, 
      color: 'text-amber-400', 
      glow: 'shadow-amber-500/10',
      bg: 'bg-amber-500/5 border-amber-500/15' 
    },
    { 
      name: 'Conversion Ratio', 
      value: `${conversionRate}%`, 
      icon: CheckCircle, 
      color: 'text-emerald-400', 
      glow: 'shadow-emerald-500/10',
      bg: 'bg-emerald-500/5 border-emerald-500/15' 
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div 
          key={stat.name} 
          className={`bg-zinc-950/40 backdrop-blur-md overflow-hidden rounded-2xl border border-zinc-900/60 p-6 shadow-xl ${stat.glow} hover:border-zinc-800 transition-all duration-300 group`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-xl border flex items-center justify-center ${stat.bg} group-hover:scale-105 transition-transform duration-300`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-xs font-semibold text-zinc-500 uppercase tracking-wider truncate">
                  {stat.name}
                </dt>
                <dd className="mt-1 flex items-baseline">
                  <div className="text-3xl font-display font-extrabold text-white tracking-tight leading-none">
                    {stat.value}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopAnalytics;
