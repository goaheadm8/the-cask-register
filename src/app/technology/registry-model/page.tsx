'use client';

import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { CheckCircle, Camera, Tag, ShieldCheck, MapPin, HandshakeIcon, } from "lucide-react";
import { Shield, Briefcase, Factory, Globe } from "lucide-react";
import { Handshake, GlobeHemisphereWest } from 'phosphor-react'




export default function RegistryModelPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 px-6 pb-32 max-w-6xl mx-auto text-black animate-fadeIn">
        <h1 className="text-4xl font-bold mb-8 text-center">About CaskMark ID</h1>

        {/* Top Section with Overview and ID Format */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          {/* Left Column: Overview */}
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-2xl font-semibold mb-4">What is the CaskMark ID?</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>CaskMark is the first platform to treat whisky and spirit casks as regulated-grade investment assets.</strong> 
              We work with distilleries, brokers, warehouses, and owners to validate, tag, and monitor casks throughout their lifecycle. 
              Through transparent verification and digital identity issuance, we bring consistency, trust, and accountability to a historically opaque market.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>The CaskMark ID</strong> is a unique identifier assigned only to casks that have met our rigorous standards of authenticity and documentation. 
              Each ID encodes key attributes—distillery, year of fill, spirit type, and a serial number—providing tamper-resistant traceability. 
              This makes the CaskMark ID not just a tag, but a sign of verification and trust.
            </p>
          </div>

          {/* Right Column: ID Format */}
          <div className="md:w-1/3">
            <div className="bg-muted border rounded-lg p-6 h-full">
              <h3 className="text-xl font-semibold mb-4 text-center">CaskMark ID Format</h3>
              <p className="font-mono text-lg mb-4 text-center bg-white p-2 rounded-md shadow-sm">CM-GB-24-SC-G1-000001-X</p>
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                <div><strong>CM</strong>: CaskMark Prefix</div>
                <div><strong>GB</strong>: Country Code</div>
                <div><strong>24</strong>: Year of Fill</div>
                <div><strong>SC</strong>: Spirit Type</div>
                <div><strong>G1</strong>: Distillery Code</div>
                <div><strong>000001</strong>: Serial Number</div>
                <div><strong>X</strong>: Checksum Digit</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue with remaining overview content */}
        <section className="mb-16 space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            Much like ISINs are used for securities settlement, the <strong>CaskMark ID</strong> enables secure registration, ownership transfers, provenance tracking, and investment-grade documentation. 
            Only casks that provide evidence of physical existence, legal ownership, and quality assurance are eligible. 
            Applicants must submit documents such as warehouse receipts, invoices, photographs, and other forms of verifiable proof to qualify for a CaskMark.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            As the only registry of its kind, <strong>CaskMark is establishing a new standard for cask investment</strong> - building trust one cask at a time.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>Note:</strong> Whisky cask investment is currently not regulated by the Financial Conduct Authority (FCA) in the UK
            <sup className="text-xs"><a href="https://www.fca.org.uk/scamsmart/unregulated-investment-products" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">[1]</a></sup>. 
            However, due to the growing number of retail investors and increasing reports of misrepresentation and fraud, 
            regulatory oversight is likely to increase in the coming years.  
            <strong>CaskMark</strong> has been created to proactively bring structure, transparency, and due diligence standards to the space - before regulation mandates it.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            [1] Financial Conduct Authority. "Unregulated investment products." FCA ScamSmart, 2024.
          </p>
        </section>

 {/* Verification Lifecycle with integrated timeline */}
<section className="mb-20">
  <h2 className="text-2xl font-semibold mb-6">Verification Lifecycle</h2>
  <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg border shadow-sm overflow-hidden">
    <div className="p-6">
      <p className="text-gray-700 mb-6">Our rigorous verification process ensures each cask's authenticity and traceability throughout its investment lifecycle:</p>
      
      {/* CaskMark ID explanation with Accordion */}
      <div className="mb-12">
        <Accordion type="single" collapsible className="border-0">
          <AccordionItem value="id-info" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 bg-white hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-amber-100 border-2 border-amber-500">
                  <ShieldCheck className="text-amber-600" size={24} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold">CaskMark ID Generation Process</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 border-t bg-white">
              <div className="ml-12">
                <p className="text-gray-700 mb-3 leading-relaxed">
                  The CaskMark ID is only generated during the verification process once 
                  an NFC tag is requested. This ensures that only properly verified casks 
                  receive this unique identifier.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Why This Matters</h4>
                  <p className="text-blue-700 text-sm">
                    By only issuing CaskMark IDs after verification begins, we ensure that every 
                    ID in circulation represents a cask that has undergone at least the initial 
                    stages of our verification process. This maintains the integrity of the 
                    CaskMark system and prevents unauthorized ID creation.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* Integrated Accordion and Timeline */}
      <div className="relative">
        {/* Vertical line for timeline */}
        <div className="absolute left-10 top-8 bottom-8 w-1 bg-amber-400 hidden md:block"></div>
        
        {/* This is the key fix: Wrap the entire timeline in a div, not the Accordion component */}
        <div className="timeline-container">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row mb-6">
            {/* Timeline node - only visible on desktop */}
            <div className="hidden md:flex absolute left-10 -translate-x-1/2 w-8 h-8 bg-amber-100 rounded-full border-2 border-amber-500 z-10 items-center justify-center">
              <span className="text-amber-800 font-bold">1</span>
            </div>
            
            {/* Left side: Timeline details */}
            <div className="md:w-1/3 mb-4 md:mb-0 md:pr-4 md:pl-16">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <h4 className="font-bold text-gray-800">Registration on CaskMark</h4>
              </div>
            </div>
            
            {/* Right side: Accordion */}
            <div className="md:w-2/3">
              <Accordion type="single" collapsible className="border-0">
                <AccordionItem value="step-1" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 bg-white hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-green-100 border-2 border-green-500">
                        <Tag className="text-green-600" size={24} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-lg font-semibold">Step 1: Initial Registration</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 border-t bg-white">
                    <div className="ml-12">
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        The registration process begins when a broker, warehouse, or owner submits the cask's details on our platform. 
                        Essential information including distillery of origin, fill date, cask type, and spirit category is provided. 
                        While owners typically initiate this process as they gain the most from verification, any authorized party in the supply chain can begin the registration.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 border-l-4 border-green-500">
                        <strong>Requirements:</strong> Purchase invoice, warehouse receipt, spirit specification
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col md:flex-row mb-6">
            {/* Timeline node - only visible on desktop */}
            <div className="hidden md:flex absolute left-10 -translate-x-1/2 w-8 h-8 bg-amber-100 rounded-full border-2 border-amber-500 z-10 items-center justify-center">
              <span className="text-amber-800 font-bold">2</span>
            </div>
            
            {/* Left side: Timeline details */}
            <div className="md:w-1/3 mb-4 md:mb-0 md:pr-4 md:pl-16">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <h4 className="font-bold text-gray-800">Third-Party Verification Request</h4>
              </div>
            </div>
            
            {/* Right side: Accordion */}
            <div className="md:w-2/3">
              <Accordion type="single" collapsible className="border-0">
                <AccordionItem value="step-2" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 bg-white hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 border-2 border-blue-500">
                        <CheckCircle className="text-blue-600" size={24} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-lg font-semibold">Step 2: Independent Verification</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 border-t bg-white">
                    <div className="ml-12">
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        An independent third party must confirm the cask's existence and details. Ideally, this is the distillery of origin, 
                        but it may also be a regulated warehouse, bonded facility, or authorized broker who wasn't involved in the initial registration. 
                        This crucial step ensures all cask information is validated by multiple sources.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 border-l-4 border-blue-500">
                        <strong>Validation points:</strong> Independent confirmation, warehouse records, customs & excise status
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Step 3 - Highlighted for CaskMark ID Generation */}
          <div className="flex flex-col md:flex-row mb-6">
            {/* Timeline node - only visible on desktop */}
            <div className="hidden md:flex absolute left-10 -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full border-2 border-green-600 z-10 items-center justify-center">
              <span className="text-white font-bold">3</span>
            </div>
            
            {/* Left side: Timeline details - highlighted */}
            <div className="md:w-1/3 mb-4 md:mb-0 md:pr-4 md:pl-16">
              <div className="bg-green-50 p-3 rounded-lg shadow-sm border-l-4 border-green-500">
                <h4 className="font-bold text-green-800">CaskMark ID Generation</h4>
                <p className="text-sm text-green-700 mt-1">
                  <strong>CaskMark ID is created at this stage</strong> and encoded into an NFC tag for physical attachment to the cask.
                </p>
              </div>
            </div>
            
            {/* Right side: Accordion */}
            <div className="md:w-2/3">
              <Accordion type="single" collapsible className="border-0">
                <AccordionItem value="step-3" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 bg-white hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-orange-100 border-2 border-orange-500">
                        <ShieldCheck className="text-orange-600" size={24} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-lg font-semibold">Step 3: NFC Tag Issuance & Application</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 border-t bg-white">
                    <div className="ml-12">
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        After initial verification, a tamper-resistant NFC tag encoded with a unique CaskMark ID is dispatched to the warehouse or broker. 
                        This physical tag must be attached to the cask or, at minimum, presented with the cask during the photo verification step. 
                        The NFC tag serves as the physical representation of the cask's digital identity.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 border-l-4 border-orange-500">
                        <strong>Tag features:</strong> Tamper-evident, cryptographically secured, unique CaskMark ID encoded
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="flex flex-col md:flex-row mb-6">
            {/* Timeline node - only visible on desktop */}
            <div className="hidden md:flex absolute left-10 -translate-x-1/2 w-8 h-8 bg-amber-100 rounded-full border-2 border-amber-500 z-10 items-center justify-center">
              <span className="text-amber-800 font-bold">4</span>
            </div>
            
            {/* Left side: Timeline details */}
            <div className="md:w-1/3 mb-4 md:mb-0 md:pr-4 md:pl-16">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <h4 className="font-bold text-gray-800">Documentation Saved</h4>
              </div>
            </div>
            
            {/* Right side: Accordion */}
            <div className="md:w-2/3">
              <Accordion type="single" collapsible className="border-0">
                <AccordionItem value="step-4" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 bg-white hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-purple-100 border-2 border-purple-500">
                        <Camera className="text-purple-600" size={24} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-lg font-semibold">Step 4: Photographic Proof</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 border-t bg-white">
                    <div className="ml-12">
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        The broker or warehouse manager must photograph the cask with the NFC tag and CaskMark ID clearly visible. 
                        This visual evidence links the physical cask to its digital identity. All photos are timestamped and encrypted, 
                        then permanently recorded in the blockchain as incontrovertible proof of the cask's existence and condition.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 border-l-4 border-purple-500">
                        <strong>Photo requirements:</strong> Clear cask number, visible CaskMark ID tag, full cask view
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Step 5 */}
          <div className="flex flex-col md:flex-row mb-6">
            {/* Timeline node - only visible on desktop */}
            <div className="hidden md:flex absolute left-10 -translate-x-1/2 w-8 h-8 bg-amber-100 rounded-full border-2 border-amber-500 z-10 items-center justify-center">
              <span className="text-amber-800 font-bold">5</span>
            </div>
            
            {/* Left side: Timeline details */}
            <div className="md:w-1/3 mb-4 md:mb-0 md:pr-4 md:pl-16">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <h4 className="font-bold text-gray-800">Final CaskMark ID Verification</h4>
              </div>
            </div>
            
            {/* Right side: Accordion */}
            <div className="md:w-2/3">
              <Accordion type="single" collapsible className="border-0">
                <AccordionItem value="step-5" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-4 py-3 bg-white hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-red-100 border-2 border-red-500">
                        <MapPin className="text-red-600" size={24} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-lg font-semibold">Step 5: Geo-Verification & Blockchain Recording</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 border-t bg-white">
                    <div className="ml-12">
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        The final step involves scanning the NFC tag while at the cask's location. This action records the GPS coordinates, 
                        confirming the cask's location matches the registered warehouse, and simultaneously uploads all verification data to the blockchain. 
                        Once recorded, this information becomes immutable and serves as the definitive verification record for the cask.
                      </p>
                      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 border-l-4 border-red-500">
                        <strong>Data recorded:</strong> GPS coordinates, verification photos, timestamp, authenticator identity
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="p-6 pt-0">
      <div className="p-4 bg-amber-50 rounded-md border border-amber-200">
        <h4 className="font-semibold text-amber-800 mb-2">Continuous Monitoring</h4>
        <p className="text-amber-700">
          Once fully verified with all steps complete, the cask's data is permanently secured on the blockchain. Periodic re-verification is required during ownership transfers, 
          warehouse movements, or after significant time periods. Any unusual activity or verification failures trigger immediate alerts to all stakeholders.
        </p>
      </div>
    </div>
  </div>
</section>


        {/* Benefits */}
<section className="mb-20 py-12 bg-gradient-to-b from-amber-50 to-white rounded-2xl">
  <h2 className="text-3xl font-bold mb-8 text-center">Why Use CaskMark?</h2>
  <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12 px-6">
    Our verification system provides distinct advantages to all stakeholders in the cask investment ecosystem.  You are not just getting a tag; you are getting a comprehensive solution that enhances trust, transparency and value in your asset.
  </p>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 max-w-5xl mx-auto">
    
    {/* Owners / Investors */}
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      <div className="h-2 bg-blue-600"></div>
      <CardContent className="p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center mb-4">For Owners & Investors</h3>
        <ul className="text-gray-700 space-y-3">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Blockchain-secured proof of ownership</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Independent validation of documentation</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Enhanced credibility for resale opportunities</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Tamper-evident ID & physical NFC tagging</span>
          </li>
        </ul>
      </CardContent>
    </Card>

    {/* Brokers */}
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      <div className="h-2 bg-amber-600"></div>
      <CardContent className="p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <HandshakeIcon size={24} color="Blue" className="w-8 h-8 " />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center mb-4">For Brokers</h3>
        <ul className="text-gray-700 space-y-3">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Industry-standard cask metadata protocol</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Verified listings to build buyer confidence</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Complete transfer & verification history</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Streamlined onboarding for institutional buyers</span>
          </li>
        </ul>
      </CardContent>
    </Card>

    {/* Distilleries */}
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      <div className="h-2 bg-green-600"></div>
      <CardContent className="p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Factory className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center mb-4">For Distilleries</h3>
        <ul className="text-gray-700 space-y-3">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Prevent unauthorized resale or duplication</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Protect brand integrity in secondary markets</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Optional provenance API for supply chain</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Ensure only valid assets carry your brand</span>
          </li>
        </ul>
      </CardContent>
    </Card>

    {/* The Industry */}
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      <div className="h-2 bg-purple-600"></div>
      <CardContent className="p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
          <GlobeHemisphereWest size={24} color="purple" className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center mb-4">For the Industry</h3>
        <ul className="text-gray-700 space-y-3">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Establishes consistency and transparency</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Reduces fraud and falsified certificates</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Prepares market for upcoming regulation</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
            <span>Standardized cask ownership documentation</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>

</section>
      </main>
      <Footer />
    </>
  );
}