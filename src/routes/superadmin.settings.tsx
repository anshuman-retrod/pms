import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Globe,
  DollarSign,
  Trash2,
  Plus,
  Check,
  X,
  FileText,
  Building,
  RefreshCw,
  Percent,
  Edit2
} from "lucide-react";
import { PageHeader, Card, Button } from "@/components/ui/Primitives";
import {
  settingsApi,
  type SystemLanguageData,
  type SystemCurrencyData,
  type SystemDateFormatData,
  type SystemTimeFormatData
} from "@/services/api/settings";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/superadmin/settings")({
  validateSearch: (search: Record<string, unknown>) => {
    return {};
  },
  head: () => ({ meta: [{ title: "Settings — Superadmin" }] }),
  component: SuperadminSettingsComponent,
});

const inputCls =
  "h-9 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";
const selectCls =
  "h-9 w-full rounded-md border border-border bg-surface px-2 text-[13px] text-text-primary focus:border-primary focus:outline-none";
const labelCls = "mb-1 block text-[12px] font-medium text-text-secondary";

import { useAuth } from "@/features/auth/hooks/useAuth";
import AccessDenied from "@/components/AccessDenied";

function SuperadminSettingsComponent() {
  const { user } = useAuth();

  if (user?.role !== "super_admin") {
    return (
      <AccessDenied
        title="Platform Settings Restricted"
        description="You do not have administrative privileges to access the Retrod superadmin controller."
      />
    );
  }

  const [activeTab, setActiveTab] = useState<"taxes" | "documents" | "facilities" | "languages" | "currency">("taxes");

  // Settings states
  const [currencies, setCurrencies] = useState<SystemCurrencyData[]>([]);
  const [dateFormats, setDateFormats] = useState<SystemDateFormatData[]>([]);
  const [timeFormats, setTimeFormats] = useState<SystemTimeFormatData[]>([]);
  const [activeCurrency, setActiveCurrency] = useState<SystemCurrencyData | null>(null);
  const [activeDateFormat, setActiveDateFormat] = useState<SystemDateFormatData | null>(null);
  const [activeTimeFormat, setActiveTimeFormat] = useState<SystemTimeFormatData | null>(null);
  const [languages, setLanguages] = useState<SystemLanguageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Languages modal
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [newLangName, setNewLangName] = useState("");
  const [newLangCode, setNewLangCode] = useState("");
  const [newLangActive, setNewLangActive] = useState(true);
  const [newLangDefault, setNewLangDefault] = useState(false);

  // Setups interfaces & states
  interface TaxSetup {
    id: string;
    name: string;
    rate: number;
    type: "percentage" | "fixed";
    status: "active" | "inactive";
  }

  interface DocumentSetup {
    id: string;
    name: string;
    required_checkin: boolean;
    expiry_required: boolean;
  }

  interface FacilitySetup {
    id: string;
    name: string;
    chargeable: boolean;
    price: number;
    description: string;
    iconName: string;
  }

  const [taxes, setTaxes] = useState<TaxSetup[]>([]);
  const [documents, setDocuments] = useState<DocumentSetup[]>([]);
  const [facilities, setFacilities] = useState<FacilitySetup[]>([]);

  // Editing state variables
  const [editingTax, setEditingTax] = useState<TaxSetup | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentSetup | null>(null);
  const [editingFacility, setEditingFacility] = useState<FacilitySetup | null>(null);
  const [editingLanguage, setEditingLanguage] = useState<SystemLanguageData | null>(null);

  // Delete target confirmation state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "tax" | "document" | "facility" | "language";
    id: string;
    name: string;
    langObj?: SystemLanguageData;
  } | null>(null);

  // Modals visibility state
  const [taxModalOpen, setTaxModalOpen] = useState(false);
  const [newTaxName, setNewTaxName] = useState("");
  const [newTaxRate, setNewTaxRate] = useState<number>(0);
  const [newTaxType, setNewTaxType] = useState<"percentage" | "fixed">("percentage");
  const [newTaxStatus, setNewTaxStatus] = useState<"active" | "inactive">("active");

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocRequired, setNewDocRequired] = useState(false);
  const [newDocExpiry, setNewDocExpiry] = useState(false);

  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [newFacName, setNewFacName] = useState("");
  const [newFacChargeable, setNewFacChargeable] = useState(false);
  const [newFacPrice, setNewFacPrice] = useState<number>(0);
  const [newFacDesc, setNewFacDesc] = useState("");
  const [newFacIcon, setNewFacIcon] = useState("wifi");

  // Load backend configurations
  const loadData = async () => {
    setLoading(true);
    try {
      const [langData, taxData, docData, facData, curData, dfData, tfData] = await Promise.all([
        settingsApi.getLanguages(),
        settingsApi.getTaxes(),
        settingsApi.getDocuments(),
        settingsApi.getFacilities(),
        settingsApi.getCurrencies(),
        settingsApi.getDateFormats(),
        settingsApi.getTimeFormats()
      ]);

      setCurrencies(curData);
      setDateFormats(dfData);
      setTimeFormats(tfData);

      const defaultCur = curData.find(c => c.is_default) || curData[0] || {
        code: "USD",
        symbol: "$",
        name: "US Dollar",
        is_default: true,
        symbol_position: "after",
        decimal_places: 2,
        decimal_separator: "dot",
        thousands_separator: "comma",
        add_space: true,
        show_decimals: true
      };
      const defaultDF = dfData.find(d => d.is_default) || dfData[0] || { format: "YYYY-MM-DD", label: "YYYY-MM-DD", is_default: true };
      const defaultTF = tfData.find(t => t.is_default) || tfData[0] || { format: "HH:mm", label: "HH:mm", is_default: true };

      setActiveCurrency(defaultCur);
      setActiveDateFormat(defaultDF);
      setActiveTimeFormat(defaultTF);
      setLanguages(langData);

      // Populate taxes
      if (taxData && taxData.length > 0) {
        setTaxes(taxData.map(t => ({
          id: t.id || "",
          name: t.name,
          rate: t.rate,
          type: t.type,
          status: t.status
        })));
      } else {
        const defaultTaxes = [
          { name: "VAT (Value Added Tax)", rate: 15, type: "percentage" as const, status: "active" as const },
          { name: "Service Tax", rate: 5, type: "percentage" as const, status: "active" as const },
          { name: "Tourism Levy", rate: 10, type: "fixed" as const, status: "inactive" as const }
        ];
        const seeded = await Promise.all(defaultTaxes.map(t => settingsApi.createTax(t)));
        setTaxes(seeded.map(t => ({
          id: t.id || "",
          name: t.name,
          rate: t.rate,
          type: t.type,
          status: t.status
        })));
      }

      // Populate documents
      if (docData && docData.length > 0) {
        setDocuments(docData.map(d => ({
          id: d.id || "",
          name: d.name,
          required_checkin: d.required_checkin,
          expiry_required: d.expiry_required
        })));
      } else {
        const defaultDocs = [
          { name: "Passport", required_checkin: true, expiry_required: true },
          { name: "National ID Card", required_checkin: true, expiry_required: false },
          { name: "Driver's License", required_checkin: false, expiry_required: true }
        ];
        const seeded = await Promise.all(defaultDocs.map(d => settingsApi.createDocument(d)));
        setDocuments(seeded.map(d => ({
          id: d.id || "",
          name: d.name,
          required_checkin: d.required_checkin,
          expiry_required: d.expiry_required
        })));
      }

      // Populate facilities
      if (facData && facData.length > 0) {
        setFacilities(facData.map((f: any) => ({
          id: f.id || "",
          name: f.name,
          chargeable: f.chargeable,
          price: Number(f.price),
          description: f.description,
          iconName: f.icon_name || f.iconName || "wifi"
        })));
      } else {
        const defaultFacs = [
          { name: "High-Speed Wi-Fi", chargeable: false, price: 0, description: "Complimentary gigabit fiber connection in all rooms and public areas.", icon_name: "wifi" },
          { name: "Swimming Pool", chargeable: false, price: 0, description: "Access to outdoor heated infinity swimming pool.", icon_name: "pool" },
          { name: "Luxury Spa", chargeable: true, price: 50, description: "Full-service wellness treatments, massage therapy, and sauna.", icon_name: "spa" },
          { name: "Valet Parking", chargeable: true, price: 15, description: "24/7 secure valet vehicle parking with EV charging stations.", icon_name: "parking" }
        ];
        const seeded = await Promise.all(defaultFacs.map(f => settingsApi.createFacility(f)));
        setFacilities(seeded.map((f: any) => ({
          id: f.id || "",
          name: f.name,
          chargeable: f.chargeable,
          price: Number(f.price),
          description: f.description,
          iconName: f.icon_name || f.iconName || "wifi"
        })));
      }
    } catch (err: any) {
      toast.error("Failed to load settings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Scrollspy & smooth scroll logic
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const container = document.getElementById("settings-scroll-container");
      if (container) {
        const topPos = el.offsetTop - container.offsetTop;
        container.scrollTo({ top: topPos, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const container = document.getElementById("settings-scroll-container");
    if (!container) return;

    const sections = ["taxes-section", "documents-section", "facilities-section", "languages-section", "currency-section"];
    
    const handleScroll = () => {
      const containerTop = container.scrollTop;
      
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const offsetTop = el.offsetTop - container.offsetTop;
          const offsetHeight = el.offsetHeight;
          if (containerTop >= offsetTop - 60 && containerTop < offsetTop + offsetHeight - 60) {
            const tabId = sec.replace("-section", "");
            setActiveTab(tabId as any);
            break;
          }
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // 1. Save Currency Settings
      if (activeCurrency) {
        const target = currencies.find(c => c.code === activeCurrency.code);
        if (target) {
          await Promise.all(
            currencies
              .filter(c => c.is_default && c.id !== target.id)
              .map(c => settingsApi.updateCurrency(c.id!, { is_default: false }))
          );
          await settingsApi.updateCurrency(target.id!, {
            is_default: true,
            symbol_position: activeCurrency.symbol_position,
            decimal_places: activeCurrency.decimal_places,
            decimal_separator: activeCurrency.decimal_separator,
            thousands_separator: activeCurrency.thousands_separator,
            add_space: activeCurrency.add_space,
            show_decimals: activeCurrency.show_decimals
          });
        }
      }

      // 2. Save Date Format
      if (activeDateFormat) {
        const targetDF = dateFormats.find(d => d.format === activeDateFormat.format);
        if (targetDF) {
          await Promise.all(
            dateFormats
              .filter(d => d.is_default && d.id !== targetDF.id)
              .map(d => settingsApi.updateDateFormat(d.id!, { is_default: false }))
          );
          await settingsApi.updateDateFormat(targetDF.id!, { is_default: true });
        } else {
          await Promise.all(
            dateFormats.filter(d => d.is_default).map(d => settingsApi.updateDateFormat(d.id!, { is_default: false }))
          );
          await settingsApi.createDateFormat({
            format: activeDateFormat.format,
            label: activeDateFormat.format,
            is_default: true
          });
        }
      }

      // 3. Save Time Format
      if (activeTimeFormat) {
        const targetTF = timeFormats.find(t => t.format === activeTimeFormat.format);
        if (targetTF) {
          await Promise.all(
            timeFormats
              .filter(t => t.is_default && t.id !== targetTF.id)
              .map(t => settingsApi.updateTimeFormat(t.id!, { is_default: false }))
          );
          await settingsApi.updateTimeFormat(targetTF.id!, { is_default: true });
        } else {
          await Promise.all(
            timeFormats.filter(t => t.is_default).map(t => settingsApi.updateTimeFormat(t.id!, { is_default: false }))
          );
          await settingsApi.createTimeFormat({
            format: activeTimeFormat.format,
            label: activeTimeFormat.format,
            is_default: true
          });
        }
      }

      await loadData();
      toast.success("Settings saved successfully.");
    } catch (err: any) {
      toast.error("Failed to save settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaxName.trim()) {
      toast.error("Tax name is required.");
      return;
    }

    try {
      if (editingTax) {
        const updated = await settingsApi.updateTax(editingTax.id, {
          name: newTaxName.trim(),
          rate: Number(newTaxRate),
          type: newTaxType,
          status: newTaxStatus
        });
        setTaxes(taxes.map(t => t.id === editingTax.id ? (updated as any) : t));
        toast.success("Tax updated successfully.");
      } else {
        const created = await settingsApi.createTax({
          name: newTaxName.trim(),
          rate: Number(newTaxRate),
          type: newTaxType,
          status: newTaxStatus
        });
        setTaxes([...taxes, created as any]);
        toast.success("Tax configured successfully.");
      }
      setTaxModalOpen(false);
      setEditingTax(null);
      setNewTaxName("");
      setNewTaxRate(0);
      setNewTaxType("percentage");
      setNewTaxStatus("active");
    } catch (err: any) {
      toast.error("Failed to save tax: " + err.message);
    }
  };

  const handleToggleTaxStatus = async (id: string) => {
    const tax = taxes.find(t => t.id === id);
    if (!tax) return;
    const nextStatus = tax.status === "active" ? "inactive" : "active";
    try {
      const updated = await settingsApi.updateTax(id, { status: nextStatus });
      setTaxes(taxes.map(t => t.id === id ? (updated as any) : t));
      toast.success("Tax status updated.");
    } catch (err: any) {
      toast.error("Failed to update status: " + err.message);
    }
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) {
      toast.error("Document type name is required.");
      return;
    }

    try {
      if (editingDoc) {
        const updated = await settingsApi.updateDocument(editingDoc.id, {
          name: newDocName.trim(),
          required_checkin: newDocRequired,
          expiry_required: newDocExpiry
        });
        setDocuments(documents.map(d => d.id === editingDoc.id ? (updated as any) : d));
        toast.success("Document type updated successfully.");
      } else {
        const created = await settingsApi.createDocument({
          name: newDocName.trim(),
          required_checkin: newDocRequired,
          expiry_required: newDocExpiry
        });
        setDocuments([...documents, created as any]);
        toast.success("Document type registered successfully.");
      }
      setDocModalOpen(false);
      setEditingDoc(null);
      setNewDocName("");
      setNewDocRequired(false);
      setNewDocExpiry(false);
    } catch (err: any) {
      toast.error("Failed to save document type: " + err.message);
    }
  };

  const handleToggleDocRequired = async (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    try {
      const updated = await settingsApi.updateDocument(id, { required_checkin: !doc.required_checkin });
      setDocuments(documents.map(d => d.id === id ? (updated as any) : d));
      toast.success("Check-in requirement updated.");
    } catch (err: any) {
      toast.error("Failed to update check-in requirement: " + err.message);
    }
  };

  const handleToggleDocExpiry = async (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    try {
      const updated = await settingsApi.updateDocument(id, { expiry_required: !doc.expiry_required });
      setDocuments(documents.map(d => d.id === id ? (updated as any) : d));
      toast.success("Expiry verification requirement updated.");
    } catch (err: any) {
      toast.error("Failed to update expiry verification requirement: " + err.message);
    }
  };

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacName.trim()) {
      toast.error("Facility name is required.");
      return;
    }

    try {
      if (editingFacility) {
        const updated = await settingsApi.updateFacility(editingFacility.id, {
          name: newFacName.trim(),
          chargeable: newFacChargeable,
          price: newFacChargeable ? Number(newFacPrice) : 0,
          description: newFacDesc.trim(),
          icon_name: newFacIcon
        });
        const mappedUpdated = {
          id: updated.id || "",
          name: updated.name,
          chargeable: updated.chargeable,
          price: Number(updated.price),
          description: updated.description,
          iconName: updated.icon_name || "wifi"
        };
        setFacilities(facilities.map(f => f.id === editingFacility.id ? mappedUpdated : f));
        toast.success("Facility updated successfully.");
      } else {
        const created = await settingsApi.createFacility({
          name: newFacName.trim(),
          chargeable: newFacChargeable,
          price: newFacChargeable ? Number(newFacPrice) : 0,
          description: newFacDesc.trim(),
          icon_name: newFacIcon
        });
        const mappedCreated = {
          id: created.id || "",
          name: created.name,
          chargeable: created.chargeable,
          price: Number(created.price),
          description: created.description,
          iconName: created.icon_name || "wifi"
        };
        setFacilities([...facilities, mappedCreated]);
        toast.success("Facility registered successfully.");
      }
      setFacilityModalOpen(false);
      setEditingFacility(null);
      setNewFacName("");
      setNewFacChargeable(false);
      setNewFacPrice(0);
      setNewFacDesc("");
      setNewFacIcon("wifi");
    } catch (err: any) {
      toast.error("Failed to save facility: " + err.message);
    }
  };

  const handleToggleFacChargeable = async (id: string) => {
    const fac = facilities.find(f => f.id === id);
    if (!fac) return;
    const nextChargeable = !fac.chargeable;
    try {
      const updated = await settingsApi.updateFacility(id, {
        chargeable: nextChargeable,
        price: nextChargeable ? 10 : 0
      });
      const mappedUpdated = {
        id: updated.id || "",
        name: updated.name,
        chargeable: updated.chargeable,
        price: Number(updated.price),
        description: updated.description,
        iconName: updated.icon_name || "wifi"
      };
      setFacilities(facilities.map(f => f.id === id ? mappedUpdated : f));
      toast.success("Facility pricing mode toggled.");
    } catch (err: any) {
      toast.error("Failed to toggle pricing mode: " + err.message);
    }
  };

  const handleCreateLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim() || !newLangCode.trim()) {
      toast.error("Please provide both name and code.");
      return;
    }
    try {
      if (editingLanguage) {
        const updated = await settingsApi.updateLanguage(editingLanguage.id!, {
          name: newLangName.trim(),
          code: newLangCode.trim().toLowerCase(),
          is_active: newLangActive,
          is_default: newLangDefault
        });
        setLanguages((prev) => prev.map((l) => (l.id === editingLanguage.id ? updated : l)));
        toast.success("Language updated successfully.");
      } else {
        const created = await settingsApi.createLanguage({
          name: newLangName.trim(),
          code: newLangCode.trim().toLowerCase(),
          is_active: newLangActive,
          is_default: newLangDefault
        });
        setLanguages((prev) => [...prev, created]);
        toast.success("Language added successfully.");
      }

      if (newLangDefault || (editingLanguage && editingLanguage.is_default !== newLangDefault)) {
        const langData = await settingsApi.getLanguages();
        setLanguages(langData);
      }
      setLangModalOpen(false);
      setEditingLanguage(null);
      setNewLangName("");
      setNewLangCode("");
    } catch (err: any) {
      toast.error("Failed to save language: " + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id, name, langObj } = deleteTarget;
    try {
      if (type === "tax") {
        await settingsApi.deleteTax(id);
        setTaxes(taxes.filter(t => t.id !== id));
        toast.success(`Tax "${name}" deleted successfully.`);
      } else if (type === "document") {
        await settingsApi.deleteDocument(id);
        setDocuments(documents.filter(d => d.id !== id));
        toast.success(`Document type "${name}" unregistered.`);
      } else if (type === "facility") {
        await settingsApi.deleteFacility(id);
        setFacilities(facilities.filter(f => f.id !== id));
        toast.success(`Facility "${name}" unregistered.`);
      } else if (type === "language" && langObj) {
        if (langObj.is_default) {
          toast.error("Default language cannot be deleted.");
          return;
        }
        await settingsApi.deleteLanguage(langObj.id!);
        setLanguages((prev) => prev.filter((l) => l.id !== langObj.id));
        toast.success(`Language "${name}" deleted successfully.`);
      }
    } catch (err: any) {
      toast.error(`Failed to delete: ${err.message}`);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggleLangActive = async (lang: SystemLanguageData) => {
    try {
      const updated = await settingsApi.updateLanguage(lang.id!, {
        is_active: !lang.is_active
      });
      setLanguages((prev) => prev.map((l) => (l.id === lang.id ? updated : l)));
      toast.success(`${lang.name} status updated.`);
    } catch (err: any) {
      toast.error("Failed to update status: " + err.message);
    }
  };

  const handleSetLangDefault = async (lang: SystemLanguageData) => {
    try {
      await settingsApi.updateLanguage(lang.id!, {
        is_default: true,
        is_active: true
      });
      const data = await settingsApi.getLanguages();
      setLanguages(data);
      toast.success(`${lang.name} is now set as the default system language.`);
    } catch (err: any) {
      toast.error("Failed to set default language: " + err.message);
    }
  };

  const handleDeleteLang = async (lang: SystemLanguageData) => {
    if (lang.is_default) {
      toast.error("Default language cannot be deleted.");
      return;
    }
    try {
      await settingsApi.deleteLanguage(lang.id!);
      setLanguages((prev) => prev.filter((l) => l.id !== lang.id));
      toast.success("Language deleted successfully.");
    } catch (err: any) {
      toast.error("Failed to delete language: " + err.message);
    }
  };

  // Currency Formatter Preview calculation
  const formattedCurrencyPreview = useMemo(() => {
    if (!activeCurrency) return "1,234.56 $";
    const amt = 1234.56;
    const decimals = activeCurrency.decimal_places ?? 2;
    const separator = activeCurrency.decimal_separator === "dot" ? "." : ",";
    const thousands = activeCurrency.thousands_separator === "comma" ? "," : activeCurrency.thousands_separator === "dot" ? "." : " ";
    const showDec = activeCurrency.show_decimals ?? true;
    const addSpace = activeCurrency.add_space ? " " : "";

    let formattedAmt = "";
    if (showDec) {
      const fixed = amt.toFixed(decimals);
      const parts = fixed.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
      formattedAmt = parts.join(separator);
    } else {
      formattedAmt = Math.round(amt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    }

    const symbol = activeCurrency.symbol || "$";

    if (activeCurrency.symbol_position === "before") {
      return `${symbol}${addSpace}${formattedAmt}`;
    } else {
      return `${formattedAmt}${addSpace}${symbol}`;
    }
  }, [activeCurrency]);

  if (loading || !activeCurrency || !activeDateFormat || !activeTimeFormat) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-56px)] flex flex-col overflow-hidden bg-background">
      <PageHeader
        eyebrow="Platform Controller"
        title="Settings"
        description="Configure tax rates, accepted check-in documents, facilities, and regional settings."
      />
      <div className="responsive-page-x py-4 flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] items-stretch w-full flex-1 overflow-hidden min-h-0">
          {/* Sub tabs sidebar */}
          <Card className="h-fit p-2 sticky top-24 shadow-md border-border bg-surface hover:shadow-lg transition-all duration-300">
            <ul className="space-y-1.5">
              {[
                { id: "taxes", label: "Tax Setup", icon: Percent },
                { id: "documents", label: "Document Setup", icon: FileText },
                { id: "facilities", label: "Facility Setup", icon: Building },
                { id: "languages", label: "Language & Format", icon: Globe },
                { id: "currency", label: "Currency Settings", icon: DollarSign }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => scrollToSection(`${tab.id}-section`)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-[13.5px] font-semibold transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-primary text-white shadow-sm shadow-primary/20 scale-[1.02]"
                          : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 transition-transform duration-200 ${activeTab === tab.id ? "scale-110" : ""}`} />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Stacked and scrollspy scrollable container */}
          <div
            id="settings-scroll-container"
            className="h-full overflow-y-auto pr-2 space-y-6 scroll-smooth scrollbar-thin w-full pb-8"
          >
            {/* TAX SETUP PANEL */}
            <div id="taxes-section">
              <Card className="p-5 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                  <div>
                    <h3 className="text-[16px] font-bold text-text-primary flex items-center gap-2">
                      <Percent className="h-4 w-4 text-primary" /> Tax Setup
                    </h3>
                    <p className="text-[12px] text-text-secondary mt-0.5">Manage tax rates, service fees, and VAT rule assignments.</p>
                  </div>
                  <button
                    onClick={() => setTaxModalOpen(true)}
                    className="flex h-8 items-center gap-1 rounded-md bg-primary px-3 text-[11.5px] font-semibold text-white hover:bg-primary-pressed shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" /> Configure Tax
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left text-[12.5px]">
                    <thead>
                      <tr className="border-b border-border bg-surface-2 text-text-secondary font-medium">
                        <th className="px-4 py-3">Tax Name</th>
                        <th className="px-4 py-3">Rate</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface">
                      {taxes.map((tax) => (
                        <tr key={tax.id} className="hover:bg-surface-2/30">
                          <td className="px-4 py-3 font-medium text-text-primary">{tax.name}</td>
                          <td className="px-4 py-3 font-mono text-[12px] text-text-secondary">
                            {tax.rate}{tax.type === "percentage" ? "%" : " (Fixed)"}
                          </td>
                          <td className="px-4 py-3 text-text-secondary capitalize">{tax.type}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleTaxStatus(tax.id)}
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase transition ${
                                tax.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {tax.status === "active" ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingTax(tax);
                                setNewTaxName(tax.name);
                                setNewTaxRate(tax.rate);
                                setNewTaxType(tax.type);
                                setNewTaxStatus(tax.status);
                                setTaxModalOpen(true);
                              }}
                              className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                              title="Edit Tax"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: "tax", id: tax.id, name: tax.name })}
                              className="text-text-secondary hover:text-destructive transition-colors cursor-pointer"
                              title="Delete Tax"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* DOCUMENT SETUP PANEL */}
            <div id="documents-section">
              <Card className="p-5 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                  <div>
                    <h3 className="text-[16px] font-bold text-text-primary flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" /> Document Setup
                    </h3>
                    <p className="text-[12px] text-text-secondary mt-0.5">Define guest identification documents accepted during check-in.</p>
                  </div>
                  <button
                    onClick={() => setDocModalOpen(true)}
                    className="flex h-8 items-center gap-1 rounded-md bg-primary px-3 text-[11.5px] font-semibold text-white hover:bg-primary-pressed shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Document Type
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left text-[12.5px]">
                    <thead>
                      <tr className="border-b border-border bg-surface-2 text-text-secondary font-medium">
                        <th className="px-4 py-3">Document Type</th>
                        <th className="px-4 py-3 text-center">Required for Check-in</th>
                        <th className="px-4 py-3 text-center">Expiry Date Verification</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-surface-2/30">
                          <td className="px-4 py-3 font-medium text-text-primary">{doc.name}</td>
                          <td className="px-4 py-3 text-center">
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={doc.required_checkin}
                                onChange={() => handleToggleDocRequired(doc.id)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                            </label>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={doc.expiry_required}
                                onChange={() => handleToggleDocExpiry(doc.id)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                            </label>
                          </td>
                          <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingDoc(doc);
                                setNewDocName(doc.name);
                                setNewDocRequired(doc.required_checkin);
                                setNewDocExpiry(doc.expiry_required);
                                setDocModalOpen(true);
                              }}
                              className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                              title="Edit Document Type"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: "document", id: doc.id, name: doc.name })}
                              className="text-text-secondary hover:text-destructive transition-colors cursor-pointer"
                              title="Delete Document Type"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* FACILITY SETUP PANEL */}
            <div id="facilities-section">
              <Card className="p-5 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                  <div>
                    <h3 className="text-[16px] font-bold text-text-primary flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary" /> Facility Setup
                    </h3>
                    <p className="text-[12px] text-text-secondary mt-0.5">Manage property-wide facilities, services, and charging rules.</p>
                  </div>
                  <button
                    onClick={() => setFacilityModalOpen(true)}
                    className="flex h-8 items-center gap-1 rounded-md bg-primary px-3 text-[11.5px] font-semibold text-white hover:bg-primary-pressed shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" /> Register Facility
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {facilities.map((fac) => {
                    return (
                      <div key={fac.id} className="group relative rounded-xl border border-border bg-surface p-4 hover:shadow-md transition duration-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary font-bold">
                                {fac.iconName === "wifi" ? <Globe className="h-4.5 w-4.5" /> : fac.iconName === "pool" ? <RefreshCw className="h-4.5 w-4.5" /> : fac.iconName === "spa" ? <Globe className="h-4.5 w-4.5" /> : <DollarSign className="h-4.5 w-4.5" />}
                              </div>
                              <h4 className="text-[13.5px] font-bold text-text-primary">{fac.name}</h4>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <button
                                onClick={() => {
                                  setEditingFacility(fac);
                                  setNewFacName(fac.name);
                                  setNewFacChargeable(fac.chargeable);
                                  setNewFacPrice(fac.price);
                                  setNewFacDesc(fac.description);
                                  setNewFacIcon(fac.iconName);
                                  setFacilityModalOpen(true);
                                }}
                                className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                                title="Edit Facility"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: "facility", id: fac.id, name: fac.name })}
                                className="text-text-secondary hover:text-destructive transition-colors cursor-pointer"
                                title="Delete Facility"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[11.5px] text-text-secondary leading-normal mb-3">{fac.description}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-border/60 pt-3">
                          <label className="flex items-center gap-2 text-[12px] text-text-secondary cursor-pointer">
                            <input
                              type="checkbox"
                              checked={fac.chargeable}
                              onChange={() => handleToggleFacChargeable(fac.id)}
                              className="h-3.5 w-3.5 rounded"
                            />
                            Chargeable Service
                          </label>
                          <span className="font-mono text-[12px] font-bold text-text-primary">
                            {fac.chargeable ? `${activeCurrency?.symbol || "$"}${fac.price.toFixed(2)}` : "Free"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* LANGUAGES & FORMATS PANEL */}
            <div id="languages-section">
              <Card className="p-5 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                  <div>
                    <h3 className="text-[16px] font-bold text-text-primary flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" /> Language & Date/Time Formats
                    </h3>
                    <p className="text-[12px] text-text-secondary mt-0.5">Configure system formats and add support for multiple languages.</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={saving}
                    onClick={handleSaveSettings}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelCls}>Date Format</label>
                      <select
                        className={selectCls}
                        value={activeDateFormat?.format}
                        onChange={(e) => setActiveDateFormat({ ...activeDateFormat, format: e.target.value } as any)}
                      >
                        <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-06-24)</option>
                        <option value="DD-MM-YYYY">DD-MM-YYYY (e.g. 24-06-2026)</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 06/24/2026)</option>
                        <option value="DD MMM YYYY">DD MMM YYYY (e.g. 24 Jun 2026)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Time Format</label>
                      <select
                        className={selectCls}
                        value={activeTimeFormat?.format}
                        onChange={(e) => setActiveTimeFormat({ ...activeTimeFormat, format: e.target.value } as any)}
                      >
                        <option value="HH:mm">24 Hour format (e.g. 14:30)</option>
                        <option value="hh:mm A">12 Hour format (e.g. 02:30 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-border pt-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-[13.5px] font-bold text-text-primary">System Languages</h4>
                        <p className="text-[11.5px] text-text-secondary">Enable and assign active languages for localized screens.</p>
                      </div>
                      <button
                        onClick={() => setLangModalOpen(true)}
                        className="flex h-8 items-center gap-1 rounded-md bg-primary-tint px-3 text-[11.5px] font-semibold text-primary hover:bg-primary-tint/80"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Language
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-left text-[12.5px]">
                        <thead>
                          <tr className="border-b border-border bg-surface-2 text-text-secondary font-medium">
                            <th className="px-4 py-3">Language</th>
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Active</th>
                            <th className="px-4 py-3">Default</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-surface">
                          {languages.map((lang) => (
                            <tr key={lang.id} className="hover:bg-surface-2/30">
                              <td className="px-4 py-3 font-medium text-text-primary">{lang.name}</td>
                              <td className="px-4 py-3 font-mono text-[11.5px] text-text-secondary uppercase">{lang.code}</td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleToggleLangActive(lang)}
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase transition ${
                                    lang.is_active
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {lang.is_active ? "Active" : "Disabled"}
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                {lang.is_default ? (
                                  <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                                    <Check className="h-3.5 w-3.5" /> Default
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleSetLangDefault(lang)}
                                    className="text-[11px] font-medium text-text-disabled hover:text-primary hover:underline"
                                  >
                                    Set Default
                                  </button>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingLanguage(lang);
                                    setNewLangName(lang.name);
                                    setNewLangCode(lang.code);
                                    setNewLangActive(lang.is_active);
                                    setNewLangDefault(lang.is_default);
                                    setLangModalOpen(true);
                                  }}
                                  className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                                  title="Edit Language"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  disabled={lang.is_default}
                                  onClick={() => setDeleteTarget({ type: "language", id: lang.id!, name: lang.name, langObj: lang })}
                                  className="text-text-secondary hover:text-destructive disabled:opacity-30 transition-colors cursor-pointer"
                                  title="Delete Language"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* CURRENCY SETTINGS PANEL */}
            <div id="currency-section">
              <Card className="p-5 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                  <div>
                    <h3 className="text-[16px] font-bold text-text-primary flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" /> Currency Settings
                    </h3>
                    <p className="text-[12px] text-text-secondary mt-0.5">Configure how currency values are displayed throughout the application.</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={saving}
                    onClick={handleSaveSettings}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-border bg-surface p-5 flex items-center justify-between shadow-sm">
                    <div>
                      <div className="text-[28px] font-bold text-text-primary transition-all">
                        {formattedCurrencyPreview}
                      </div>
                      <div className="text-[11.5px] text-text-secondary mt-0.5">
                        {activeCurrency?.name} ({activeCurrency?.code})
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeCurrency) {
                          setActiveCurrency({
                            ...activeCurrency,
                            symbol_position: "after",
                            decimal_places: 2,
                            decimal_separator: "dot",
                            thousands_separator: "comma",
                            add_space: true,
                            show_decimals: true
                          });
                        }
                      }}
                      className="h-8 rounded-lg border border-border bg-surface px-3 text-[12px] hover:bg-surface-2 transition"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className={labelCls}>Default Currency</label>
                      <select
                        className={selectCls}
                        value={activeCurrency?.code}
                        onChange={(e) => {
                          const match = currencies.find(c => c.code === e.target.value);
                          if (match) {
                            setActiveCurrency(match);
                          }
                        }}
                      >
                        {currencies.map(c => (
                          <option key={c.id} value={c.code}>
                            {c.symbol} {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Symbol Position</label>
                      <select
                        className={selectCls}
                        value={activeCurrency?.symbol_position || "after"}
                        onChange={(e) => {
                          if (activeCurrency) {
                            setActiveCurrency({ ...activeCurrency, symbol_position: e.target.value });
                          }
                        }}
                      >
                        <option value="before">Before Amount (e.g. $ 100)</option>
                        <option value="after">After Amount (e.g. 100 $)</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Decimal Places</label>
                      <input
                        type="number"
                        className={inputCls}
                        min={0}
                        max={4}
                        value={activeCurrency?.decimal_places ?? 2}
                        onChange={(e) => {
                          if (activeCurrency) {
                            setActiveCurrency({ ...activeCurrency, decimal_places: parseInt(e.target.value) || 0 });
                          }
                        }}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Decimal Separator</label>
                      <select
                        className={selectCls}
                        value={activeCurrency?.decimal_separator || "dot"}
                        onChange={(e) => {
                          if (activeCurrency) {
                            setActiveCurrency({ ...activeCurrency, decimal_separator: e.target.value });
                          }
                        }}
                      >
                        <option value="dot">Dot (.)</option>
                        <option value="comma">Comma (,)</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelCls}>Thousands Separator</label>
                      <select
                        className={selectCls}
                        value={activeCurrency?.thousands_separator || "comma"}
                        onChange={(e) => {
                          if (activeCurrency) {
                            setActiveCurrency({ ...activeCurrency, thousands_separator: e.target.value });
                          }
                        }}
                      >
                        <option value="comma">Comma (,)</option>
                        <option value="dot">Dot (.)</option>
                        <option value="space">Space ( )</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end gap-3 pb-1.5">
                      <label className="flex items-center gap-2 text-[12.5px] text-text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeCurrency?.add_space ?? true}
                          onChange={(e) => {
                            if (activeCurrency) {
                              setActiveCurrency({ ...activeCurrency, add_space: e.target.checked });
                            }
                          }}
                          className="h-3.5 w-3.5 rounded"
                        />
                        Add space between symbol and amount
                      </label>
                      <label className="flex items-center gap-2 text-[12.5px] text-text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeCurrency?.show_decimals ?? true}
                          onChange={(e) => {
                            if (activeCurrency) {
                              setActiveCurrency({ ...activeCurrency, show_decimals: e.target.checked });
                            }
                          }}
                          className="h-3.5 w-3.5 rounded"
                        />
                        Show decimals
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <strong>{deleteTarget?.type}</strong>: <strong>{deleteTarget?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {/* Add/Edit language modal/drawer */}
      {langModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setLangModalOpen(false);
              setEditingLanguage(null);
              setNewLangName("");
              setNewLangCode("");
              setNewLangActive(true);
              setNewLangDefault(false);
            }}
          />

          {/* Drawer content */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-surface border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
              {/* Drawer Header */}
              <div className="p-6 border-b border-border bg-surface-2/30 flex items-start justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-text-primary">
                    {editingLanguage ? "Edit Language" : "Add Language"}
                  </h2>
                  <p className="text-[12.5px] text-text-secondary mt-1">
                    {editingLanguage ? "Modify the system language settings." : "Configure a new language for the platform."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLangModalOpen(false);
                    setEditingLanguage(null);
                    setNewLangName("");
                    setNewLangCode("");
                    setNewLangActive(true);
                    setNewLangDefault(false);
                  }}
                  className="p-1 rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Form / Body */}
              <form onSubmit={handleCreateLanguage} className="flex-grow flex flex-col min-h-0">
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  <div>
                    <label className={labelCls}>Language Name</label>
                    <input
                      type="text"
                      required
                      className={inputCls}
                      placeholder="e.g. Spanish"
                      value={newLangName}
                      onChange={(e) => setNewLangName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Language Code</label>
                    <input
                      type="text"
                      required
                      maxLength={8}
                      className={inputCls}
                      placeholder="e.g. es"
                      value={newLangCode}
                      onChange={(e) => setNewLangCode(e.target.value)}
                      disabled={!!editingLanguage}
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-[12.5px] text-text-secondary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newLangActive}
                        onChange={(e) => setNewLangActive(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary/15 h-4 w-4"
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-2 text-[12.5px] text-text-secondary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newLangDefault}
                        onChange={(e) => setNewLangDefault(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary/15 h-4 w-4"
                        disabled={editingLanguage?.is_default}
                      />
                      Set Default
                    </label>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="flex justify-end gap-2 p-6 border-t border-border bg-surface-2/10 mt-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setLangModalOpen(false);
                      setEditingLanguage(null);
                      setNewLangName("");
                      setNewLangCode("");
                      setNewLangActive(true);
                      setNewLangDefault(false);
                    }}
                    className="h-9 rounded-md border border-border px-4 text-[13px] hover:bg-surface-2 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 rounded-md bg-primary px-5 text-[13px] font-medium text-primary-foreground hover:bg-primary-pressed transition"
                  >
                    {editingLanguage ? "Save Changes" : "Add Language"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Configure Tax Modal/drawer */}
      {taxModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setTaxModalOpen(false);
              setEditingTax(null);
              setNewTaxName("");
              setNewTaxRate(0);
              setNewTaxType("percentage");
              setNewTaxStatus("active");
            }}
          />

          {/* Drawer content */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-surface border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
              {/* Drawer Header */}
              <div className="p-6 border-b border-border bg-surface-2/30 flex items-start justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-text-primary">
                    {editingTax ? "Edit Tax Configuration" : "Configure Tax"}
                  </h2>
                  <p className="text-[12.5px] text-text-secondary mt-1">
                    {editingTax ? "Update settings for the selected tax rate." : "Set up a new tax rate and rule for calculations."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTaxModalOpen(false);
                    setEditingTax(null);
                    setNewTaxName("");
                    setNewTaxRate(0);
                    setNewTaxType("percentage");
                    setNewTaxStatus("active");
                  }}
                  className="p-1 rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Form / Body */}
              <form onSubmit={handleCreateTax} className="flex-grow flex flex-col min-h-0">
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  <div>
                    <label className={labelCls}>Tax Name</label>
                    <input
                      type="text"
                      required
                      className={inputCls}
                      placeholder="e.g. VAT, GST, Service Tax"
                      value={newTaxName}
                      onChange={(e) => setNewTaxName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Tax Rate</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        className={inputCls}
                        value={newTaxRate}
                        onChange={(e) => setNewTaxRate(parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Tax Type</label>
                      <select
                        className={selectCls}
                        value={newTaxType}
                        onChange={(e) => setNewTaxType(e.target.value as any)}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Rate ({activeCurrency?.symbol || "$"})</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select
                      className={selectCls}
                      value={newTaxStatus}
                      onChange={(e) => setNewTaxStatus(e.target.value as any)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="flex justify-end gap-2 p-6 border-t border-border bg-surface-2/10 mt-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setTaxModalOpen(false);
                      setEditingTax(null);
                      setNewTaxName("");
                      setNewTaxRate(0);
                      setNewTaxType("percentage");
                      setNewTaxStatus("active");
                    }}
                    className="h-9 rounded-md border border-border px-4 text-[13px] hover:bg-surface-2 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 rounded-md bg-primary px-5 text-[13px] font-medium text-primary-foreground hover:bg-primary-pressed transition"
                  >
                    {editingTax ? "Save Changes" : "Configure"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal/drawer */}
      {docModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setDocModalOpen(false);
              setEditingDoc(null);
              setNewDocName("");
              setNewDocRequired(false);
              setNewDocExpiry(false);
            }}
          />

          {/* Drawer content */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-surface border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
              {/* Drawer Header */}
              <div className="p-6 border-b border-border bg-surface-2/30 flex items-start justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-text-primary">
                    {editingDoc ? "Edit Document Type" : "Add Document Type"}
                  </h2>
                  <p className="text-[12.5px] text-text-secondary mt-1">
                    {editingDoc ? "Modify requirement settings for this document." : "Register a new document requirement for guest check-in."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setDocModalOpen(false);
                    setEditingDoc(null);
                    setNewDocName("");
                    setNewDocRequired(false);
                    setNewDocExpiry(false);
                  }}
                  className="p-1 rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Form / Body */}
              <form onSubmit={handleCreateDoc} className="flex-grow flex flex-col min-h-0">
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  <div>
                    <label className={labelCls}>Document Type Name</label>
                    <input
                      type="text"
                      required
                      className={inputCls}
                      placeholder="e.g. Passport, National ID"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-[12.5px] text-text-secondary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newDocRequired}
                        onChange={(e) => setNewDocRequired(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary/15 h-4 w-4"
                      />
                      Required
                    </label>
                    <label className="flex items-center gap-2 text-[12.5px] text-text-secondary cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newDocExpiry}
                        onChange={(e) => setNewDocExpiry(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary/15 h-4 w-4"
                      />
                      Verify Expiry Date
                    </label>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="flex justify-end gap-2 p-6 border-t border-border bg-surface-2/10 mt-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setDocModalOpen(false);
                      setEditingDoc(null);
                      setNewDocName("");
                      setNewDocRequired(false);
                      setNewDocExpiry(false);
                    }}
                    className="h-9 rounded-md border border-border px-4 text-[13px] hover:bg-surface-2 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 rounded-md bg-primary px-5 text-[13px] font-medium text-primary-foreground hover:bg-primary-pressed transition"
                  >
                    {editingDoc ? "Save Changes" : "Add Type"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {facilityModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setFacilityModalOpen(false);
              setEditingFacility(null);
              setNewFacName("");
              setNewFacChargeable(false);
              setNewFacPrice(0);
              setNewFacDesc("");
              setNewFacIcon("wifi");
            }}
          />

          {/* Drawer content */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-surface border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
              {/* Drawer Header */}
              <div className="p-6 border-b border-border bg-surface-2/30 flex items-start justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-text-primary">
                    {editingFacility ? "Edit Facility" : "Register Facility"}
                  </h2>
                  <p className="text-[12.5px] text-text-secondary mt-1">
                    {editingFacility ? "Update the facility's details and charging rules." : "Add a new amenity or service option for properties."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFacilityModalOpen(false);
                    setEditingFacility(null);
                    setNewFacName("");
                    setNewFacChargeable(false);
                    setNewFacPrice(0);
                    setNewFacDesc("");
                    setNewFacIcon("wifi");
                  }}
                  className="p-1 rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Form / Body */}
              <form onSubmit={handleCreateFacility} className="flex-grow flex flex-col min-h-0">
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                  <div>
                    <label className={labelCls}>Facility Name</label>
                    <input
                      type="text"
                      required
                      className={inputCls}
                      placeholder="e.g. Luxury Spa, Valet Parking"
                      value={newFacName}
                      onChange={(e) => setNewFacName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Facility Icon</label>
                      <select
                        className={selectCls}
                        value={newFacIcon}
                        onChange={(e) => setNewFacIcon(e.target.value)}
                      >
                        <option value="wifi">Wi-Fi / Internet</option>
                        <option value="pool">Pool / Water</option>
                        <option value="spa">Spa / Wellness</option>
                        <option value="parking">Parking / Transport</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Pricing Mode</label>
                      <label className="flex h-9 items-center gap-2 text-[12.5px] text-text-secondary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newFacChargeable}
                          onChange={(e) => setNewFacChargeable(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary/15 h-4 w-4"
                        />
                        Chargeable
                      </label>
                    </div>
                  </div>
                  {newFacChargeable && (
                    <div>
                      <label className={labelCls}>Price / Charge per Booking ({activeCurrency?.symbol || "$"})</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        className={inputCls}
                        value={newFacPrice}
                        onChange={(e) => setNewFacPrice(parseFloat(e.target.value))}
                      />
                    </div>
                  )}
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea
                      className="w-full rounded-md border border-border bg-surface p-2.5 text-[13px] text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                      rows={3}
                      placeholder="Describe the facility services..."
                      value={newFacDesc}
                      onChange={(e) => setNewFacDesc(e.target.value)}
                    />
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="flex justify-end gap-2 p-6 border-t border-border bg-surface-2/10 mt-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFacilityModalOpen(false);
                      setEditingFacility(null);
                      setNewFacName("");
                      setNewFacChargeable(false);
                      setNewFacPrice(0);
                      setNewFacDesc("");
                      setNewFacIcon("wifi");
                    }}
                    className="h-9 rounded-md border border-border px-4 text-[13px] hover:bg-surface-2 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 rounded-md bg-primary px-5 text-[13px] font-medium text-primary-foreground hover:bg-primary-pressed transition"
                  >
                    {editingFacility ? "Save Changes" : "Register"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperadminSettingsComponent;
