import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PurchaseGate from "@/components/app/PurchaseGate";
import Navigation from "@/features/planner-90/components/Navigation";
import CoverPage from "@/features/planner-90/components/CoverPage";
import QuarterlyView from "@/features/planner-90/components/QuarterlyView";
import MonthlyView from "@/features/planner-90/components/MonthlyView";
import WeeklyTreasuryView from "@/features/planner-90/components/WeeklyTreasuryView";
import { usePlannerProgress } from "@/features/planner-90/hooks/usePlannerProgress";

const MONTH_NAMES = ["ENERO", "FEBRERO", "MARZO"];

const PlannerInner = () => {
  const { config, setConfig, status } = usePlannerProgress();
  const [section, setSection] = useState("cover");
  const [week, setWeek] = useState(1);
  const [month, setMonth] = useState(1);

  const navigate = useCallback((s: string) => {
    setSection(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentSection={section}
        onNavigate={navigate}
        currentWeek={week}
        currentMonth={month}
        onWeekChange={setWeek}
        onMonthChange={setMonth}
        status={status}
      />
      <div className="h-[110px] md:h-[68px]" />
      <AnimatePresence mode="wait">
        {section === "cover" && (
          <motion.div key="cover" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <CoverPage />
          </motion.div>
        )}
        {section === "quarterly" && (
          <motion.div key="quarterly" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <QuarterlyView config={config} setConfig={setConfig} />
          </motion.div>
        )}
        {section === "monthly" && (
          <motion.div key={`m-${month}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <MonthlyView monthNumber={month} monthName={MONTH_NAMES[month - 1]} config={config} setConfig={setConfig} />
          </motion.div>
        )}
        {section === "weekly" && (
          <motion.div key={`w-${week}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <WeeklyTreasuryView weekNumber={week} config={config} setConfig={setConfig} />
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="py-8 px-6 text-center bg-muted/50">
        <p className="text-sm text-muted-foreground">🚀 El Big Bang de los Negocios · Planner de Ejecución 90 Días</p>
      </footer>
    </div>
  );
};

const Planner = () => (
  <div className="min-h-screen bg-background">
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <PurchaseGate productId="planner-ejecucion-90-dias">
        <div className="-mx-4 -mt-6">
          <PlannerInner />
        </div>
      </PurchaseGate>
    </div>
  </div>
);

export default Planner;
