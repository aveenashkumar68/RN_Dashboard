import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useBusinessStore } from '../store/businessStore';
import InfoCard from '../components/InfoCard';
import StatCard from '../components/StatCard';
import QuickActionCard from '../components/QuickActionCard';
import {
  EmailIcon,
  MapPinIcon,
  CardIcon,
  InvoiceIcon,
  ReportIcon,
  UserPlusIcon,
  UsersIcon,
  UploadIcon,
  EditIcon,
  CloseIcon,
  VerifyIcon,
  BuildingIcon,
  FileTextIcon,
} from '../components/Icons';

function LocalProfileHeader({ businessDetails }) {
  const { companyName, verificationBadge, businessType, gstStatus } = businessDetails;
  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4">
      <View className="flex-row items-center">
        <View className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 items-center justify-center mr-4">
          <Text className="text-2xl font-bold text-indigo-600">
            {companyName ? companyName.substring(0, 2).toUpperCase() : "VT"}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center flex-wrap">
            <Text className="text-xl font-bold text-slate-800 mr-2">{companyName}</Text>
            {verificationBadge && (
              <View className="flex-row items-center bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                <VerifyIcon size={12} color="#0284c7" />
                <Text className="text-[10px] font-semibold text-sky-700 ml-1">
                  {verificationBadge}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center mt-1.5">
            <BuildingIcon size={14} color="#64748b" />
            <Text className="text-sm text-slate-500 ml-1">{businessType}</Text>
          </View>
          
          <View className="flex-row items-center mt-2">
            <View className="bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" />
              <Text className="text-xs font-semibold text-emerald-700">
                GST {gstStatus}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function LocalDocumentCard({ document }) {
  const { name, type, status, uploadDate } = document;

  const handleDownload = () => {
    Alert.alert(
      "Document Download",
      `Your download for ${name} (${type}) has started successfully.`,
      [{ text: "OK" }]
    );
  };

  const getStatusBadge = (statusName) => {
    const formattedStatus = (statusName || "").toLowerCase();
    if (formattedStatus === 'verified') {
      return (
        <View className="bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex-row items-center">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
          <Text className="text-[10px] font-bold text-emerald-700">Verified</Text>
        </View>
      );
    } else if (formattedStatus === 'processing') {
      return (
        <View className="bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex-row items-center">
          <View className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" />
          <Text className="text-[10px] font-bold text-amber-700">Processing</Text>
        </View>
      );
    } else {
      return (
        <View className="bg-slate-50 px-2 py-0.5 rounded-full border border-slate-150 flex-row items-center">
          <View className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1" />
          <Text className="text-[10px] font-bold text-slate-600">{statusName}</Text>
        </View>
      );
    }
  };

  return (
    <View className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex-row items-center justify-between">
      <View className="flex-row items-center flex-1 mr-3">
        <View className="w-10 h-10 rounded-lg bg-indigo-50/50 border border-indigo-100 items-center justify-center mr-3">
          <FileTextIcon size={20} color="#4f46e5" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-slate-700" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-xs text-slate-400 mt-1">
            {type} • {uploadDate}
          </Text>
        </View>
      </View>

      <View className="items-end flex-shrink-0">
        {getStatusBadge(status)}
        <TouchableOpacity 
          onPress={handleDownload} 
          activeOpacity={0.7}
          className="mt-2 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200"
        >
          <Text className="text-[10px] font-bold text-slate-600">Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function BusinessProfileScreen() {
  const store = useBusinessStore();

  const [activeModal, setActiveModal] = useState(null);

  const [ownerName, setOwnerName] = useState(store.contactDetails.ownerName);
  const [email, setEmail] = useState(store.contactDetails.email);
  const [mobileNumber, setMobileNumber] = useState(store.contactDetails.mobileNumber);
  const [website, setWebsite] = useState(store.contactDetails.website);
  const [street, setStreet] = useState(store.address.street);
  const [city, setCity] = useState(store.address.city);
  const [stateName, setStateName] = useState(store.address.state);
  const [pinCode, setPinCode] = useState(store.address.pinCode);

  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [empName, setEmpName] = useState('');
  const [empDep, setEmpDep] = useState('Engineering');
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('GST Certificate');

  const triggerReportDownload = () => {
    Alert.alert(
      "Download Report",
      "Would you like to download the Q2 Financial Tax Report?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Download", 
          onPress: () => {
            Alert.alert("Success", "PDF Report saved to your downloads.");
            useBusinessStore.setState((state) => ({
              recentActivity: [
                {
                  id: `act-${Date.now()}`,
                  title: "Financial Report Downloaded",
                  description: "Q2 Tax and Invoice statement downloaded in PDF format.",
                  timestamp: "Just now",
                  type: "report",
                },
                ...state.recentActivity,
              ]
            }));
          }
        }
      ]
    );
  };

  const handleSaveProfile = () => {
    store.updateBusinessProfile({
      contactDetails: { ownerName, email, mobileNumber, website },
      address: { street, city, state: stateName, pinCode },
    });
    setActiveModal(null);
    Alert.alert("Profile Updated", "Your changes have been saved to Zustand store.");
  };

  const handleGenerateInvoice = () => {
    if (!clientName || !amount) {
      Alert.alert("Validation Error", "Please fill in all invoice details.");
      return;
    }
    store.generateInvoice(clientName, amount);
    setClientName('');
    setAmount('');
    setActiveModal(null);
    Alert.alert("Invoice Generated", "New invoice added, and revenue logs updated.");
  };

  const handleAddEmployee = () => {
    if (!empName) {
      Alert.alert("Validation Error", "Please enter the employee name.");
      return;
    }
    store.addEmployee(empName, empDep);
    setEmpName('');
    setActiveModal(null);
    Alert.alert("Employee Registered", `${empName} has been onboarded.`);
  };

  const handleUploadDocument = () => {
    if (!docName) {
      Alert.alert("Validation Error", "Please enter the document name.");
      return;
    }
    store.uploadDocument(docName, docType);
    setDocName('');
    setActiveModal(null);
    Alert.alert("Document Uploaded", "Document uploaded and marked as Processing.");
  };

  const handleRegisterClient = () => {
    if (!clientName) {
      Alert.alert("Validation Error", "Please enter the client name.");
      return;
    }
    store.registerClient(clientName);
    setClientName('');
    setActiveModal(null);
    Alert.alert("Client Added", "Statistics and client logs updated.");
  };

  const getActivityDotStyle = (type) => {
    switch (type) {
      case 'invoice': return 'border-blue-500 bg-blue-500';
      case 'gst': return 'border-emerald-500 bg-emerald-500';
      case 'employee': return 'border-indigo-500 bg-indigo-500';
      case 'client': return 'border-amber-500 bg-amber-500';
      case 'document': return 'border-violet-500 bg-violet-500';
      default: return 'border-slate-400 bg-slate-400';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 pt-4"
      >
        <LocalProfileHeader businessDetails={store.businessDetails} />

        <View className="mb-4">
          <Text className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2.5 ml-1">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <QuickActionCard 
              label="Generate Invoice" 
              icon={InvoiceIcon} 
              colorScheme="blue" 
              onPress={() => setActiveModal('invoice')} 
            />
            <QuickActionCard 
              label="Download Report" 
              icon={ReportIcon} 
              colorScheme="emerald" 
              onPress={triggerReportDownload} 
            />
            <QuickActionCard 
              label="Add Employee" 
              icon={UserPlusIcon} 
              colorScheme="indigo" 
              onPress={() => setActiveModal('employee')} 
            />
            <QuickActionCard 
              label="Manage Clients" 
              icon={UsersIcon} 
              colorScheme="amber" 
              onPress={() => setActiveModal('client')} 
            />
            <QuickActionCard 
              label="Upload Doc" 
              icon={UploadIcon} 
              colorScheme="violet" 
              onPress={() => setActiveModal('document')} 
            />
            <View style={styles.gridPlaceholder} />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2.5 ml-1">
            Financial Overview
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-2">
            <StatCard label="Annual Revenue" value={store.statistics.annualRevenue} icon={CardIcon} colorScheme="blue" />
            <StatCard label="GST Paid" value={store.statistics.gstPaid} icon={InvoiceIcon} colorScheme="emerald" />
          </View>
          <View className="flex-row flex-wrap gap-2">
            <StatCard label="Total Invoices" value={store.statistics.totalInvoices} icon={InvoiceIcon} colorScheme="indigo" />
            <StatCard label="Active Clients" value={store.statistics.activeClients} icon={UsersIcon} colorScheme="amber" />
          </View>
        </View>

        <View className="mb-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-base font-bold text-slate-800 mb-3.5">Team Overview</Text>
          <View className="flex-row gap-2 mb-4">
            <View className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Employees</Text>
              <Text className="text-xl font-black text-slate-700">{store.teamOverview.totalEmployees}</Text>
            </View>
            <View className="flex-1 bg-emerald-50/20 p-3.5 rounded-xl border border-emerald-50">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Staff</Text>
              <Text className="text-xl font-black text-emerald-600">{store.teamOverview.activeEmployees}</Text>
            </View>
          </View>

          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Departments Breakdown</Text>
          <View className="flex-row flex-wrap gap-1.5">
            {store.teamOverview.departments.map((dept, index) => (
              <View key={index} className="bg-indigo-50/50 border border-indigo-100 px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-indigo-700">{dept}</Text>
              </View>
            ))}
          </View>
        </View>

        <InfoCard 
          title="Company Registration Details" 
          icon={CardIcon}
          items={[
            { label: "GST Number", value: store.businessDetails.gstNumber },
            { label: "PAN Card No.", value: store.businessDetails.panNumber },
            { label: "CIN Company No.", value: store.businessDetails.cinNumber },
            { label: "Est. Year", value: store.businessDetails.establishmentYear },
          ]} 
        />

        <InfoCard 
          title="Contact Representatives" 
          icon={EmailIcon}
          items={[
            { label: "Owner Name", value: store.contactDetails.ownerName },
            { label: "Email Address", value: store.contactDetails.email },
            { label: "Mobile Number", value: store.contactDetails.mobileNumber },
            { label: "Website URL", value: store.contactDetails.website },
          ]} 
        />

        <InfoCard 
          title="Official Headquarters" 
          icon={MapPinIcon}
          items={[
            { label: "Full Address", value: store.address.street },
            { label: "City Office", value: store.address.city },
            { label: "State Region", value: store.address.state },
            { label: "PIN Code", value: store.address.pinCode },
          ]} 
        />

        <View className="mb-4">
          <Text className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2.5 ml-1">
            Corporate Documents
          </Text>
          <View className="flex-col gap-3">
            {store.documents.map((doc) => (
              <LocalDocumentCard key={doc.id} document={doc} />
            ))}
          </View>
        </View>

        <View className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-base font-bold text-slate-800 mb-4.5 border-b border-slate-50 pb-2.5">
            Audit Activity Log
          </Text>
          <View className="pl-1">
            {store.recentActivity.map((activity, index) => (
              <View key={activity.id} className="flex-row items-start relative min-h-[55px]">
                {index < store.recentActivity.length - 1 && (
                  <View className="absolute left-[7px] top-[14px] bottom-[-20px] w-[2px] bg-slate-100" />
                )}
                
                <View className="z-10 mr-3.5 mt-1.5">
                  <View className={`w-3.5 h-3.5 rounded-full border-2 border-white ${getActivityDotStyle(activity.type)} shadow-sm`} />
                </View>

                <View className="flex-1 pb-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-bold text-slate-700">{activity.title}</Text>
                    <Text className="text-[10px] text-slate-400 font-semibold">{activity.timestamp}</Text>
                  </View>
                  <Text className="text-xs text-slate-500 mt-1 leading-4" numberOfLines={2}>
                    {activity.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 shadow-lg flex-row justify-between items-center">
        <View className="flex-col">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Company</Text>
          <Text className="text-sm font-extrabold text-slate-700" numberOfLines={1}>
            {store.businessDetails.companyName}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveModal('profile')}
          className="bg-indigo-600 px-5 py-3 rounded-xl flex-row items-center justify-center shadow-md shadow-indigo-200"
        >
          <EditIcon size={16} color="#ffffff" />
          <Text className="text-white font-bold text-sm ml-2">Edit Business Profile</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={activeModal === 'profile'} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View className="bg-white rounded-t-3xl p-6 border-t border-slate-100 max-h-[90%]">
              <View className="flex-row justify-between items-center pb-3 border-b border-slate-100 mb-4">
                <Text className="text-lg font-bold text-slate-800">Edit Business Details</Text>
                <TouchableOpacity onPress={() => setActiveModal(null)}>
                  <CloseIcon size={22} color="#64748b" />
                </TouchableOpacity>
              </View>
              
              <ScrollView className="space-y-4" showsVerticalScrollIndicator={false}>
                <Text className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Contacts</Text>
                <View className="gap-y-3">
                  <View>
                    <Text className="text-xs text-slate-400 font-semibold mb-1">Owner Representative</Text>
                    <TextInput 
                      value={ownerName} 
                      onChangeText={setOwnerName} 
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50/50" 
                    />
                  </View>
                  <View>
                    <Text className="text-xs text-slate-400 font-semibold mb-1">Email Address</Text>
                    <TextInput 
                      value={email} 
                      onChangeText={setEmail} 
                      keyboardType="email-address"
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50/50" 
                    />
                  </View>
                  <View>
                    <Text className="text-xs text-slate-400 font-semibold mb-1">Mobile Number</Text>
                    <TextInput 
                      value={mobileNumber} 
                      onChangeText={setMobileNumber} 
                      keyboardType="phone-pad"
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50/50" 
                    />
                  </View>
                  <View>
                    <Text className="text-xs text-slate-400 font-semibold mb-1">Website URL</Text>
                    <TextInput 
                      value={website} 
                      onChangeText={setWebsite} 
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50/50" 
                    />
                  </View>
                </View>

                <Text className="text-xs font-bold text-indigo-600 uppercase tracking-wide mt-4">Headquarters Address</Text>
                <View className="gap-y-3">
                  <View>
                    <Text className="text-xs text-slate-400 font-semibold mb-1">Full Street Address</Text>
                    <TextInput 
                      value={street} 
                      onChangeText={setStreet} 
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50/50" 
                    />
                  </View>
                  <View className="flex-row gap-2">
                    <View className="flex-1">
                      <Text className="text-xs text-slate-400 font-semibold mb-1">City</Text>
                      <TextInput 
                        value={city} 
                        onChangeText={setCity} 
                        className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50/50" 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-slate-400 font-semibold mb-1">State</Text>
                      <TextInput 
                        value={stateName} 
                        onChangeText={setStateName} 
                        className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50/50" 
                      />
                    </View>
                  </View>
                  <View>
                    <Text className="text-xs text-slate-400 font-semibold mb-1">PIN Code</Text>
                    <TextInput 
                      value={pinCode} 
                      onChangeText={setPinCode} 
                      keyboardType="number-pad"
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50/50" 
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={handleSaveProfile} 
                  className="bg-indigo-600 p-3.5 rounded-xl mt-6 items-center justify-center shadow-md shadow-indigo-100 mb-8"
                >
                  <Text className="text-white font-bold text-sm">Save Corporate Changes</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal visible={activeModal === 'invoice'} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 border-t border-slate-100 pb-10">
            <View className="flex-row justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <Text className="text-lg font-bold text-slate-800">Generate Invoice</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <CloseIcon size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            <View className="gap-y-4">
              <View>
                <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Client Company Name</Text>
                <TextInput
                  placeholder="e.g. Acme Corporation"
                  value={clientName}
                  onChangeText={setClientName}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-slate-50/50 font-medium"
                />
              </View>
              <View>
                <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Amount (INR)</Text>
                <TextInput
                  placeholder="e.g. 150000"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-slate-50/50 font-medium"
                />
              </View>
              <TouchableOpacity
                onPress={handleGenerateInvoice}
                className="bg-blue-600 p-3.5 rounded-xl mt-4 items-center justify-center shadow-md shadow-blue-150"
              >
                <Text className="text-white font-bold text-sm">Confirm & Generate Invoice</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === 'employee'} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 border-t border-slate-100 pb-10">
            <View className="flex-row justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <Text className="text-lg font-bold text-slate-800">Add Staff Member</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <CloseIcon size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            <View className="gap-y-4">
              <View>
                <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Full Name</Text>
                <TextInput
                  placeholder="e.g. Sneha Patel"
                  value={empName}
                  onChangeText={setEmpName}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-slate-50/50 font-medium"
                />
              </View>
              <View>
                <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase text-slate-505">Department</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['Engineering', 'Sales & Marketing', 'Operations', 'HR & Finance'].map((dept) => (
                    <TouchableOpacity
                      key={dept}
                      onPress={() => setEmpDep(dept)}
                      className={`px-3 py-2 rounded-full border ${
                        empDep === dept 
                          ? 'bg-indigo-600 border-indigo-600' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <Text className={`text-xs font-bold ${
                        empDep === dept ? 'text-white' : 'text-slate-500'
                      }`}>{dept}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TouchableOpacity
                onPress={handleAddEmployee}
                className="bg-indigo-600 p-3.5 rounded-xl mt-4 items-center justify-center shadow-md shadow-indigo-150"
              >
                <Text className="text-white font-bold text-sm">Add Employee</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === 'client'} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 border-t border-slate-100 pb-10">
            <View className="flex-row justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <Text className="text-lg font-bold text-slate-800">Add New Active Client</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <CloseIcon size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            <View className="gap-y-4">
              <View>
                <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Client Organization</Text>
                <TextInput
                  placeholder="e.g. Flipkart Private Ltd"
                  value={clientName}
                  onChangeText={setClientName}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-slate-50/50 font-medium"
                />
              </View>
              <TouchableOpacity
                onPress={handleRegisterClient}
                className="bg-amber-500 p-3.5 rounded-xl mt-4 items-center justify-center shadow-md shadow-amber-150"
              >
                <Text className="text-white font-bold text-sm">Register Client</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === 'document'} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 border-t border-slate-100 pb-10">
            <View className="flex-row justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <Text className="text-lg font-bold text-slate-800">Upload Certificate / Document</Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <CloseIcon size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            <View className="gap-y-4">
              <View>
                <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Document Name</Text>
                <TextInput
                  placeholder="e.g. ISO 9001 Certificate"
                  value={docName}
                  onChangeText={setDocName}
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-slate-50/50 font-medium"
                />
              </View>
              <View>
                <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Document Category</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['GST Certificate', 'PAN Card', 'MSME Certificate', 'Incorporation Certificate'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setDocType(type)}
                      className={`px-3 py-2 rounded-full border ${
                        docType === type 
                          ? 'bg-violet-600 border-violet-600' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <Text className={`text-xs font-bold ${
                        docType === type ? 'text-white' : 'text-slate-500'
                      }`}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TouchableOpacity
                onPress={handleUploadDocument}
                className="bg-violet-600 p-3.5 rounded-xl mt-4 items-center justify-center shadow-md shadow-violet-150"
              >
                <Text className="text-white font-bold text-sm">Upload Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 110,
  },
  gridPlaceholder: {
    width: '31%',
    margin: '1%',
  },
});
