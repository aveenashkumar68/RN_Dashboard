import { create } from 'zustand';
import { dummyBusinessData } from '../data/dummyBusinessData';

export const useBusinessStore = create((set) => ({
  businessDetails: dummyBusinessData.businessDetails,
  contactDetails: dummyBusinessData.contactDetails,
  address: dummyBusinessData.address,
  statistics: dummyBusinessData.statistics,
  teamOverview: dummyBusinessData.teamOverview,
  documents: dummyBusinessData.documents,
  recentActivity: dummyBusinessData.recentActivity,

  updateBusinessProfile: (updatedProfile) => set((state) => {
    const newActivity = {
      id: `act-${Date.now()}`,
      title: "Business Profile Updated",
      description: "Company contact and address details were updated.",
      timestamp: "Just now",
      type: "profile"
    };

    return {
      businessDetails: { ...state.businessDetails, ...updatedProfile.businessDetails },
      contactDetails: { ...state.contactDetails, ...updatedProfile.contactDetails },
      address: { ...state.address, ...updatedProfile.address },
      recentActivity: [newActivity, ...state.recentActivity],
    };
  }),

  addEmployee: (name, department) => set((state) => {
    const total = state.teamOverview.totalEmployees + 1;
    const active = state.teamOverview.activeEmployees + 1;
    
    let updatedDeps = [...state.teamOverview.departments];
    const depIndex = updatedDeps.findIndex(dep => dep.startsWith(department));
    if (depIndex !== -1) {
      const match = updatedDeps[depIndex].match(/\((\d+)\)/);
      if (match) {
        const count = parseInt(match[1], 10) + 1;
        updatedDeps[depIndex] = `${department} (${count})`;
      }
    } else {
      updatedDeps.push(`${department} (1)`);
    }

    const newActivity = {
      id: `act-${Date.now()}`,
      title: "Employee Added",
      description: `${name} joined the ${department} department.`,
      timestamp: "Just now",
      type: "employee"
    };

    return {
      teamOverview: {
        totalEmployees: total,
        activeEmployees: active,
        departments: updatedDeps,
      },
      recentActivity: [newActivity, ...state.recentActivity],
    };
  }),

  generateInvoice: (clientName, amount) => set((state) => {
    const currentInvoiceCount = parseInt(state.statistics.totalInvoices.replace(/,/g, ''), 10);
    const newInvoiceCount = (currentInvoiceCount + 1).toLocaleString();

    const invoiceNum = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newActivity = {
      id: `act-${Date.now()}`,
      title: `Invoice #${invoiceNum} Generated`,
      description: `Invoice of ₹${parseFloat(amount).toLocaleString('en-IN')} for ${clientName} generated.`,
      timestamp: "Just now",
      type: "invoice",
    };

    return {
      statistics: {
        ...state.statistics,
        totalInvoices: newInvoiceCount,
      },
      recentActivity: [newActivity, ...state.recentActivity],
    };
  }),

  uploadDocument: (docName, docType) => set((state) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: docName,
      type: docType,
      status: "Processing",
      uploadDate: "Just now",
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      title: "Document Uploaded",
      description: `New document "${docName}" uploaded for verification.`,
      timestamp: "Just now",
      type: "document"
    };

    return {
      documents: [...state.documents, newDoc],
      recentActivity: [newActivity, ...state.recentActivity],
    };
  }),

  registerClient: (clientName) => set((state) => {
    const activeClientsCount = parseInt(state.statistics.activeClients, 10);
    const newActiveClients = (activeClientsCount + 1).toString();

    const newActivity = {
      id: `act-${Date.now()}`,
      title: "New Client Registered",
      description: `${clientName} registered as an active client.`,
      timestamp: "Just now",
      type: "client"
    };

    return {
      statistics: {
        ...state.statistics,
        activeClients: newActiveClients,
      },
      recentActivity: [newActivity, ...state.recentActivity],
    };
  }),
}));
