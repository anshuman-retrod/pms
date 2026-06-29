import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { PageHeader, Card, CardHeader, Button } from "@/components/ui/Primitives";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, UploadCloud, Save, Building2, MapPin, Settings, DollarSign, Image as ImageIcon, Bold, Italic, Underline, List, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

function MockRichTextEditor({ id, value, onChange, placeholder }: { id: string, value: string, onChange: (val: string) => void, placeholder?: string }) {
  return (
    <div className="border border-input rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-shadow">
      <div className="flex items-center gap-1 border-b border-input bg-surface-hover px-2 py-1.5 flex-wrap">
        <button type="button" className="p-1.5 text-text-secondary hover:bg-surface-2 rounded hover:text-text-primary transition-colors"><Bold className="h-3.5 w-3.5" /></button>
        <button type="button" className="p-1.5 text-text-secondary hover:bg-surface-2 rounded hover:text-text-primary transition-colors"><Italic className="h-3.5 w-3.5" /></button>
        <button type="button" className="p-1.5 text-text-secondary hover:bg-surface-2 rounded hover:text-text-primary transition-colors"><Underline className="h-3.5 w-3.5" /></button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <button type="button" className="p-1.5 text-text-secondary hover:bg-surface-2 rounded hover:text-text-primary transition-colors"><List className="h-3.5 w-3.5" /></button>
        <button type="button" className="p-1.5 text-text-secondary hover:bg-surface-2 rounded hover:text-text-primary transition-colors"><LinkIcon className="h-3.5 w-3.5" /></button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <button type="button" className="p-1.5 text-text-secondary hover:bg-surface-2 rounded hover:text-text-primary transition-colors"><AlignLeft className="h-3.5 w-3.5" /></button>
        <button type="button" className="p-1.5 text-text-secondary hover:bg-surface-2 rounded hover:text-text-primary transition-colors"><AlignCenter className="h-3.5 w-3.5" /></button>
        <button type="button" className="p-1.5 text-text-secondary hover:bg-surface-2 rounded hover:text-text-primary transition-colors"><AlignRight className="h-3.5 w-3.5" /></button>
      </div>
      <textarea 
        id={id}
        placeholder={placeholder}
        className="flex min-h-[100px] w-full bg-background px-3 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function NewHotelFeature() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "Hotel",
    starRating: "4",
    description: "",
    currency: "INR",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    checkIn: "14:00",
    checkOut: "11:00",
    minAge: "18",
    taxId: "",
    googleMapUrl: "",
    cancellationPolicy: "",
    refundPolicy: "",
    houseRules: "",
    timezone: "Asia/Kolkata",
    cgst: "18",
    vat: "0",
    cityTax: "0",
    serviceCharge: "0",
    luxuryTax: "0",
  });

  const amenitiesList = [
    "Free WiFi", "Swimming Pool", "Fitness Center", "Spa & Wellness",
    "Restaurant", "Bar/Lounge", "Room Service", "Airport Shuttle",
    "Free Parking", "Valet Parking", "Pet Friendly", "Business Center",
    "Meeting/Banquet Facilities", "24-Hour Front Desk", "Laundry Service"
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleAmenitiesChange = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSave = () => {
    // Mock save action
    navigate({ to: "/hotels" });
  };

  return (
    <div className="pb-12">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 border-b border-border bg-surface">
        <Link to="/hotels" className="text-text-secondary hover:text-text-primary">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="label-uppercase mb-1.5">Portfolio &rsaquo; Hotels</div>
          <h1 className="font-display text-[22px] font-semibold leading-tight text-text-primary sm:text-[26px]">
            Add New Property
          </h1>
        </div>
      </div>

      <div className="responsive-page-x max-w-5xl mx-auto space-y-6 py-6">
        
        {/* Basic Information */}
        <Card>
          <CardHeader 
            title="Basic Information" 
            hint="Core details about the property." 
          />
          <div className="p-4 sm:p-6 grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name <span className="text-error">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Grand Plaza Resort" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Property Type <span className="text-error">*</span></Label>
                <select 
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Resort">Resort</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Serviced Apartment">Serviced Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Guest House">Guest House</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="starRating">Star Rating</Label>
                <select 
                  id="starRating"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.starRating}
                  onChange={(e) => setFormData({...formData, starRating: e.target.value})}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                  <option value="Unrated">Unrated / Boutique</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Base Currency</Label>
                <select 
                  id="currency"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select 
                  id="timezone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.timezone}
                  onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                >
                  {[
                    "Asia/Kolkata",
                    "Asia/Dubai",
                    "Asia/Singapore",
                    "Europe/London",
                    "America/New_York",
                  ].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Property Description</Label>
              <MockRichTextEditor
                id="description"
                placeholder="Write a compelling description of the property for guests..."
                value={formData.description}
                onChange={(val) => setFormData({...formData, description: val})}
              />
            </div>
          </div>
        </Card>

        {/* Location & Contact */}
        <Card>
          <CardHeader 
            title="Location & Contact" 
            hint="Where is it located and how can guests reach out?" 
          />
          <div className="p-4 sm:p-6 grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address <span className="text-error">*</span></Label>
              <Input 
                id="address" 
                placeholder="123 Example Street" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-error">*</span></Label>
                <Input id="city" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip / Postal Code</Label>
                <Input id="zipCode" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country <span className="text-error">*</span></Label>
                <Input id="country" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
              </div>
            </div>
            
            <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone</Label>
                <Input id="phone" type="tel" placeholder="+1 234 567 8900" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" type="email" placeholder="hello@hotel.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input id="website" type="url" placeholder="https://www.hotel.com" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
              </div>
            </div>

            <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="googleMapUrl">Google Maps Location URL</Label>
                <Input id="googleMapUrl" type="url" placeholder="https://maps.google.com/..." value={formData.googleMapUrl} onChange={(e) => setFormData({...formData, googleMapUrl: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Brand Logos</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="flex-1 bg-surface border-dashed">
                    <UploadCloud className="h-4 w-4 mr-2 text-text-secondary" />
                    Website Logo
                  </Button>
                  <Button variant="outline" className="flex-1 bg-surface border-dashed">
                    <UploadCloud className="h-4 w-4 mr-2 text-text-secondary" />
                    KOT / POS Logo
                  </Button>
                </div>
                <p className="text-[12px] text-text-secondary mt-2">Upload high-res PNGs with transparent backgrounds.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Hotel Policies */}
        <Card>
          <CardHeader title="Hotel Policies" hint="Define terms and conditions for guests." />
          <div className="p-4 sm:p-6 grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
              <MockRichTextEditor 
                id="cancellationPolicy" 
                placeholder="Specify timelines and penalty charges for cancellations..."
                value={formData.cancellationPolicy}
                onChange={(val) => setFormData({...formData, cancellationPolicy: val})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refundPolicy">Refund Policy</Label>
              <MockRichTextEditor 
                id="refundPolicy" 
                placeholder="Detail the process and timelines for refunds..."
                value={formData.refundPolicy}
                onChange={(val) => setFormData({...formData, refundPolicy: val})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="houseRules">General House Rules</Label>
              <MockRichTextEditor 
                id="houseRules" 
                placeholder="Rules regarding smoking, parties, quiet hours, etc."
                value={formData.houseRules}
                onChange={(val) => setFormData({...formData, houseRules: val})}
              />
            </div>
          </div>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader title="Policies & Restrictions" hint="Operational rules for the property." />
          <div className="p-4 sm:p-6 grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn">Check-in Time</Label>
                <Input id="checkIn" type="time" value={formData.checkIn} onChange={(e) => setFormData({...formData, checkIn: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut">Check-out Time</Label>
                <Input id="checkOut" type="time" value={formData.checkOut} onChange={(e) => setFormData({...formData, checkOut: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minAge">Min Check-in Age</Label>
                <Input id="minAge" type="number" min="0" value={formData.minAge} onChange={(e) => setFormData({...formData, minAge: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="petsAllowed">Pets Allowed</Label>
                <select 
                  id="petsAllowed"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.petsAllowed}
                  onChange={(e) => setFormData({...formData, petsAllowed: e.target.value})}
                >
                  <option value="No">No</option>
                  <option value="Yes (Free)">Yes (Free)</option>
                  <option value="Yes (Charges Apply)">Yes (Charges Apply)</option>
                  <option value="On Request">On Request</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader title="Facilities & Amenities" hint="Select all that apply to this property." />
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-input text-brand focus:ring-brand"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenitiesChange(amenity)}
                  />
                  <span className="text-sm font-medium text-text-primary">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader title="Property Photos" hint="Upload high-quality images of the exterior, lobby, and rooms." />
          <div className="p-4 sm:p-6">
            <div className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center bg-surface-hover hover:bg-surface-2 transition-colors cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-4">
                <UploadCloud className="h-6 w-6" />
              </div>
              <h3 className="text-[15px] font-medium text-text-primary mb-1">Click or drag images to upload</h3>
              <p className="text-[13px] text-text-secondary max-w-sm mb-6">
                Upload up to 50 photos. Supported formats: JPG, PNG, WEBP (Max 10MB each).
              </p>
              <Button variant="outline" className="bg-surface pointer-events-none">
                <ImageIcon className="h-4 w-4 mr-2" /> Browse Files
              </Button>
            </div>
          </div>
        </Card>

        {/* Financials */}
        <Card>
          <CardHeader title="Financial & Legal" hint="Tax and billing configurations." />
          <div className="p-4 sm:p-6 grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / Business Registration Number</Label>
                <Input id="taxId" placeholder="e.g. GSTIN / EIN" value={formData.taxId} onChange={(e) => setFormData({...formData, taxId: e.target.value})} />
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle">
              <h4 className="text-sm font-medium mb-4">GST tax structure (India) & Local Taxes</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cgst">CGST %</Label>
                  <Input id="cgst" type="number" min="0" max="100" value={formData.cgst} onChange={(e) => setFormData({...formData, cgst: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat">VAT %</Label>
                  <Input id="vat" type="number" min="0" max="100" value={formData.vat} onChange={(e) => setFormData({...formData, vat: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cityTax">City tax %</Label>
                  <Input id="cityTax" type="number" min="0" max="100" value={formData.cityTax} onChange={(e) => setFormData({...formData, cityTax: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceCharge">Service charge %</Label>
                  <Input id="serviceCharge" type="number" min="0" max="100" value={formData.serviceCharge} onChange={(e) => setFormData({...formData, serviceCharge: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="luxuryTax">Luxury tax %</Label>
                  <Input id="luxuryTax" type="number" min="0" max="100" value={formData.luxuryTax} onChange={(e) => setFormData({...formData, luxuryTax: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" onClick={() => navigate({ to: "/hotels" })}>
            Cancel
          </Button>
          <Button className="bg-brand text-white hover:bg-brand/90" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Create Property Listing
          </Button>
        </div>

      </div>
    </div>
  );
}
