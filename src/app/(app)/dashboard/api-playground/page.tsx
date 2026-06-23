'use client';

import { changePassword } from '@/apiQuery/auth/changePassword';
import { completeRegistration } from '@/apiQuery/auth/completeRegistration';
import { forgotPassword } from '@/apiQuery/auth/forgotPassword';
import { login, resendOtp } from '@/apiQuery/auth/login';
import { resetPassword } from '@/apiQuery/auth/resetPassword';
import { signup } from '@/apiQuery/auth/signup';
import { socialLogin } from '@/apiQuery/auth/socialLogin';
import { verifyEmail } from '@/apiQuery/auth/verifyEmail';
import { verifyForgotPasswordOtp } from '@/apiQuery/auth/verifyForgotPassword';
import { playgroundPassword } from '@/apiQuery/baseUrl';
import { getAccountTypes } from '@/apiQuery/categories/getAccountTypes';
import { getCategories } from '@/apiQuery/categories/getCategories';
import { getChatHistory } from '@/apiQuery/chat/getChatHistory';
import { getConversations } from '@/apiQuery/chat/getConversations';
import { markChatRead } from '@/apiQuery/chat/markRead';
import { sendMessage } from '@/apiQuery/chat/sendMessage';
import { createTwilioRoom } from '@/apiQuery/communication/createRoom';
import { sendSms } from '@/apiQuery/communication/createSms';
import { getAgoraToken } from '@/apiQuery/communication/getAgoraToken';
import { getTwilioToken } from '@/apiQuery/communication/getToken';
import { getDoctorsDiscovery } from '@/apiQuery/doctor/getDoctorDiscovery';
import { getSingleDoctor as getSingleDoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { getDoctorProfile } from '@/apiQuery/doctor/profile/getProfile';
import { updateDoctorProfile } from '@/apiQuery/doctor/profile/updateProfile';
import { uploadDoctorCertification } from '@/apiQuery/doctor/profile/uploadCertification';
import { getHospitalInvitations } from '@/apiQuery/doctor/profile/getHospitalInvitations';
import { acceptHospitalInvitation } from '@/apiQuery/doctor/profile/acceptHospitalInvitation';
import { getDoctorAvailability } from '@/apiQuery/doctor/availability/getAvailability';
import { createAvailabilitySlot } from '@/apiQuery/doctor/availability/createAvailability';
import { deleteAvailabilitySlot } from '@/apiQuery/doctor/availability/deleteAvailability';
import { updateAvailabilitySettings } from '@/apiQuery/doctor/availability/updateSettings';
import { acceptDoctorAppointment } from '@/apiQuery/doctor/appointments/acceptAppointment';
import { cancelDoctorAppointment } from '@/apiQuery/doctor/appointments/cancelAppointment';
import { completeDoctorAppointment } from '@/apiQuery/doctor/appointments/completeAppointment';
import { declineDoctorAppointment } from '@/apiQuery/doctor/appointments/declineAppointment';
import { getDoctorAppointment } from '@/apiQuery/doctor/appointments/getAppointment';
import { getDoctorAppointments } from '@/apiQuery/doctor/appointments/getAppointments';
import { getDoctorAppointmentStats } from '@/apiQuery/doctor/appointments/getAppointmentStats';
import { rescheduleDoctorAppointment } from '@/apiQuery/doctor/appointments/rescheduleAppointment';
import { startDoctorAppointment } from '@/apiQuery/doctor/appointments/startAppointment';
import { submitDoctorConsultationNotes } from '@/apiQuery/doctor/appointments/submitConsultationNotes';
import { getAppointments } from '@/apiQuery/healthcareAppointments/get/getAppointments';
import { getAppointment } from '@/apiQuery/healthcareAppointments/get/getSingleAppointment';
import { cancelAppointment } from '@/apiQuery/healthcareAppointments/patch/cancelAppointment';
import { rescheduleAppointment } from '@/apiQuery/healthcareAppointments/patch/rescheduleAppointment';
import { createAppointment } from '@/apiQuery/healthcareAppointments/post/createAppointment';
import { updateAppointmentStatus } from '@/apiQuery/healthcareAppointments/put/updateAppointmentStatus';
import { getHospitalDashboard } from '@/apiQuery/hospital';
import { deleteHospitalRole } from '@/apiQuery/hospital/delete/deleteRole';
import { getHospitalDiscovery } from '@/apiQuery/hospital/discovery/getHospitalDiscovery';
import { getSingleHospital } from '@/apiQuery/hospital/discovery/getSingleHospital';
import { getHospitalAgents } from '@/apiQuery/hospital/get/getAgents';
import { getHospitalAgentStats } from '@/apiQuery/hospital/get/getAgentStats';
import { getHospitalAppointments } from '@/apiQuery/hospital/get/getAppointments';
import { getHospitalDoctors } from '@/apiQuery/hospital/get/getDoctors';
import { getHospitalOperatingHours } from '@/apiQuery/hospital/get/getOperatingHours';
import { getHospitalPatients } from '@/apiQuery/hospital/get/getPatients';
import { getHospitalPayoutSettings } from '@/apiQuery/hospital/get/getPayoutSettings';
import { getHospitalPermissions } from '@/apiQuery/hospital/get/getPermissions';
import { getHospitalRoles } from '@/apiQuery/hospital/get/getRoles';
import { getHospitalServices } from '@/apiQuery/hospital/get/getServices';
import { getSingleDoctor } from '@/apiQuery/hospital/get/getSingleDoctor';
import { getHospitalSystemServices } from '@/apiQuery/hospital/get/getSystemServices';
import { getHospitalTeam } from '@/apiQuery/hospital/get/getTeam';
import { assignDoctorToDepartment } from '@/apiQuery/hospital/patch/assignDoctorToDepartment';
import { updateHospitalPayoutSettings } from '@/apiQuery/hospital/patch/updatePayoutSettings';
import { updateHospitalProfile } from '@/apiQuery/hospital/patch/updateProfile';
import { updateHospitalRole } from '@/apiQuery/hospital/patch/updateRole';
import { updateTeamMemberRole } from '@/apiQuery/hospital/patch/updateTeamMemberRole';
import { acceptTeamInvite } from '@/apiQuery/hospital/post/acceptInvite';
import { addServiceToHospital } from '@/apiQuery/hospital/post/addService';
import { addTeamMember } from '@/apiQuery/hospital/post/addTeamMember';
import { assignDoctor } from '@/apiQuery/hospital/post/assignDoctor';
import { assignDoctorToAgent } from '@/apiQuery/hospital/post/assignDoctorToAgent';
import { assignSpecialtyToAgent } from '@/apiQuery/hospital/post/assignSpecialtyToAgent';
import { createHospitalAgent } from '@/apiQuery/hospital/post/createAgent';
import { createHospitalOperatingHours } from '@/apiQuery/hospital/post/createOperatingHours';
import { createHospitalRole } from '@/apiQuery/hospital/post/createRoles';
import { inviteDoctor } from '@/apiQuery/hospital/post/inviteDoctor';
import { getNotifications } from '@/apiQuery/notifications/getNotifications';
import { readAllNotifications } from '@/apiQuery/notifications/readAllNotifications';
import { readNotification } from '@/apiQuery/notifications/readNotification';
import { initializePayment } from '@/apiQuery/payment/initiatePayment';
import { payWithWallet } from '@/apiQuery/payment/payWithWallet';
import { getProfile } from '@/apiQuery/users/getProfile';
import { updateProfile as updateUserProfile } from '@/apiQuery/users/updateProfile';
import { addBankAccount } from '@/apiQuery/wallet/addBankAccount';
import { getBankAccounts } from '@/apiQuery/wallet/getBankAccounts';
import { updatePrimaryAccount } from '@/apiQuery/wallet/updatePrimaryAccount';
import { deleteBankAccount } from '@/apiQuery/wallet/deleteBankAccount';
import { getBanks } from '@/apiQuery/wallet/getBanks';
import { getPayouts } from '@/apiQuery/wallet/getPayouts';
import { getWalletBalance } from '@/apiQuery/wallet/getWalletBalance';
import { getWalletTransactions } from '@/apiQuery/wallet/getWalletTransactions';
import { verifyBankAccount } from '@/apiQuery/wallet/verifyBankAccount';

import Button from '@/components/Ui/Button';
import Dropdown from '@/components/Ui/Dropdown';
import { cn } from '@/lib/utils';
import { useState, type FormEvent } from 'react';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type ParamDef = {
  key: string;
  label: string;
  placeholder?: string;
  type?: string;
};

interface EndpointDef {
  name: string;
  method: Method;
  params: ParamDef[];
  description: string;
  module: string;
}

type ModuleGroup = {
  key: string;
  label: string;
  endpoints: EndpointDef[];
};

const modules: ModuleGroup[] = [
  {
    key: 'auth',
    label: 'Auth',
    endpoints: [
      {
        method: 'POST',
        name: 'Login',
        params: [
          { key: 'email', label: 'Email', placeholder: 'user@example.com' },
          { key: 'password', label: 'Password', type: 'password' },
        ],
        description: 'POST /auth/login',
        module: 'auth',
      },
      {
        method: 'POST',
        name: 'Signup',
        params: [
          { key: 'firstName', label: 'First Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'email', label: 'Email' },
          { key: 'password', label: 'Password', type: 'password' },
          {
            key: 'accountType',
            label: 'Account Type',
            placeholder: 'HOSPITAL | SEEKER | DOCTOR | AGENT | ADMIN',
          },
        ],
        description: 'POST /auth/register',
        module: 'auth',
      },
      {
        method: 'POST',
        name: 'Forgot Password',
        params: [{ key: 'email', label: 'Email' }],
        description: 'POST /auth/forgot-password',
        module: 'auth',
      },
      {
        method: 'POST',
        name: 'Verify Forgot OTP',
        params: [
          { key: 'email', label: 'Email' },
          { key: 'code', label: 'OTP Code' },
        ],
        description: 'POST /auth/verify-forgot-password-otp',
        module: 'auth',
      },
      {
        method: 'POST',
        name: 'Reset Password',
        params: [
          { key: 'newPassword', label: 'New Password', type: 'password' },
        ],
        description: 'POST /auth/reset-password',
        module: 'auth',
      },
      {
        method: 'POST',
        name: 'Verify Email',
        params: [
          { key: 'email', label: 'Email' },
          { key: 'code', label: 'Verification Code' },
        ],
        description: 'POST /auth/verify-email',
        module: 'auth',
      },
      {
        method: 'POST',
        name: 'Resend OTP',
        params: [
          { key: 'email', label: 'Email' },
          { key: 'reason', label: 'Reason', placeholder: 'email_verification' },
        ],
        description: 'POST /auth/resend-otp',
        module: 'auth',
      },
      {
        method: 'POST',
        name: 'Change Password',
        params: [
          { key: 'oldPassword', label: 'Old Password', type: 'password' },
          { key: 'newPassword', label: 'New Password', type: 'password' },
        ],
        description: 'POST /auth/change-password',
        module: 'auth',
      },
      {
        method: 'POST',
        name: 'Complete Registration',
        params: [
          { key: 'categoryId', label: 'Category ID', type: 'number' },
          {
            key: 'accountType',
            label: 'Account Type',
            placeholder: 'HOSPITAL | SEEKER | DOCTOR | AGENT | ADMIN',
          },
        ],
        description: 'POST /auth/complete-registration',
        module: 'auth',
      },
      {
        method: 'POST',
        name: 'Social Login',
        params: [
          {
            key: 'provider',
            label: 'Provider',
            placeholder: 'google | apple | facebook',
          },
          { key: 'accessToken', label: 'Access Token (optional)' },
          { key: 'idToken', label: 'ID Token (optional)' },
        ],
        description: 'POST /auth/social-login',
        module: 'auth',
      },
    ],
  },
  {
    key: 'categories',
    label: 'Categories',
    endpoints: [
      {
        method: 'GET',
        name: 'Account Types',
        params: [],
        description: 'GET /account-types',
        module: 'categories',
      },
      {
        method: 'GET',
        name: 'Categories',
        params: [
          {
            key: 'type',
            label: 'Type',
            placeholder: 'DOCTOR | HOSPITAL',
          },
        ],
        description: 'GET /categories',
        module: 'categories',
      },
    ],
  },
  {
    key: 'doctor',
    label: 'Doctor',
    endpoints: [
      {
        method: 'GET',
        name: 'Doctor Discovery',
        params: [],
        description: 'GET /doctors-discovery',
        module: 'doctor',
      },
      {
        method: 'GET',
        name: 'Single Doctor',
        params: [{ key: 'doctorId', label: 'Doctor ID' }],
        description: 'GET /doctors-discovery/{id}',
        module: 'doctor',
      },
      {
        method: 'GET',
        name: 'Doctor Profile',
        params: [],
        description: 'GET /doctors/profile',
        module: 'doctor',
      },
      {
        method: 'PATCH',
        name: 'Update Bio',
        params: [
          { key: 'aboutUs', label: 'About Us' },
          { key: 'subcategoryId', label: 'Subcategory ID', type: 'number' },
          { key: 'feesMinute', label: 'Fee Per Minute', type: 'number' },
          { key: 'feesHour', label: 'Fee Per Hour', type: 'number' },
          {
            key: 'clinicConsultationCharge',
            label: 'Clinic Charge',
            type: 'number',
          },
          {
            key: 'videoConsultationCharge',
            label: 'Video Charge',
            type: 'number',
          },
          {
            key: 'homeConsultationCharge',
            label: 'Home Charge',
            type: 'number',
          },
          { key: 'clinicName', label: 'Clinic Name' },
          { key: 'clinicState', label: 'Clinic State' },
          { key: 'clinicCountry', label: 'Clinic Country' },
          {
            key: 'practicingLicenceDate',
            label: 'Licence Date',
            placeholder: 'YYYY-MM-DD',
          },
          { key: 'university', label: 'University' },
          { key: 'yearGraduated', label: 'Year Graduated' },
          { key: 'yearsOfExperience', label: 'Years Experience' },
          { key: 'address', label: 'Address' },
          { key: 'clinicPlace', label: 'Clinic Place' },
          { key: 'latitude', label: 'Latitude', type: 'number' },
          { key: 'longitude', label: 'Longitude', type: 'number' },
          {
            key: 'urgentCriteria',
            label: 'Urgent Criteria',
            placeholder: 'VIDEO, HOME (comma-sep)',
          },
        ],
        description: 'PATCH /doctors/update-bio',
        module: 'doctor',
      },
      {
        method: 'POST',
        name: 'Upload Certification',
        params: [],
        description: 'POST /doctors/upload-certification (requires files)',
        module: 'doctor',
      },
      {
        method: 'GET',
        name: 'Hospital Invitations',
        params: [],
        description: 'GET /doctors/hospital-invitations',
        module: 'doctor',
      },
      {
        method: 'PATCH',
        name: 'Accept Invitation',
        params: [{ key: 'id', label: 'Invitation ID' }],
        description: 'PATCH /doctors/hospital-invitations/{id}/accept',
        module: 'doctor',
      },
    ],
  },
  {
    key: 'doctorAppointments',
    label: 'Doctor Appointments',
    endpoints: [
      {
        method: 'GET',
        name: 'Appointments',
        params: [
          { key: 'page', label: 'Page', type: 'number', placeholder: '1' },
          { key: 'limit', label: 'Limit', type: 'number', placeholder: '20' },
          {
            key: 'filter',
            label: 'Filter',
            placeholder: 'all | upcoming | completed | cancelled',
          },
          { key: 'hospitalId', label: 'Hospital ID' },
        ],
        description: 'GET /doctors/appointments',
        module: 'doctorAppointments',
      },
      {
        method: 'GET',
        name: 'Stats',
        params: [],
        description: 'GET /doctors/appointments/stats',
        module: 'doctorAppointments',
      },
      {
        method: 'GET',
        name: 'Single Appointment',
        params: [{ key: 'id', label: 'Appointment ID' }],
        description: 'GET /doctors/appointments/{id}',
        module: 'doctorAppointments',
      },
      {
        method: 'PATCH',
        name: 'Accept',
        params: [{ key: 'id', label: 'Appointment ID' }],
        description: 'PATCH /doctors/appointments/{id}/accept',
        module: 'doctorAppointments',
      },
      {
        method: 'PATCH',
        name: 'Decline',
        params: [
          { key: 'id', label: 'Appointment ID' },
          { key: 'reason', label: 'Reason' },
        ],
        description: 'PATCH /doctors/appointments/{id}/decline',
        module: 'doctorAppointments',
      },
      {
        method: 'PATCH',
        name: 'Cancel',
        params: [
          { key: 'id', label: 'Appointment ID' },
          { key: 'reason', label: 'Reason' },
        ],
        description: 'PATCH /doctors/appointments/{id}/cancel',
        module: 'doctorAppointments',
      },
      {
        method: 'PATCH',
        name: 'Start',
        params: [{ key: 'id', label: 'Appointment ID' }],
        description: 'PATCH /doctors/appointments/{id}/start',
        module: 'doctorAppointments',
      },
      {
        method: 'PATCH',
        name: 'Complete',
        params: [{ key: 'id', label: 'Appointment ID' }],
        description: 'PATCH /doctors/appointments/{id}/complete',
        module: 'doctorAppointments',
      },
      {
        method: 'POST',
        name: 'Consultation Notes',
        params: [
          { key: 'id', label: 'Appointment ID' },
          { key: 'diagnostic', label: 'Diagnostic' },
          { key: 'symptomsObserved', label: 'Symptoms Observed' },
          { key: 'prescription', label: 'Prescription' },
          { key: 'followUpInstructions', label: 'Follow Up Instructions' },
        ],
        description: 'POST /doctors/appointments/{id}/consultation-notes',
        module: 'doctorAppointments',
      },
      {
        method: 'PATCH',
        name: 'Reschedule',
        params: [
          { key: 'id', label: 'Appointment ID' },
          { key: 'appointmentDate', label: 'Date', placeholder: 'YYYY-MM-DD' },
          { key: 'appointmentTime', label: 'Time', placeholder: 'hh:mm A' },
        ],
        description: 'PATCH /doctors/appointments/{id}/reschedule',
        module: 'doctorAppointments',
      },
    ],
  },
  {
    key: 'doctorAvailability',
    label: 'Doctor Availability',
    endpoints: [
      {
        method: 'GET',
        name: 'Availability',
        params: [],
        description: 'GET /doctors/availability',
        module: 'doctorAvailability',
      },
      {
        method: 'POST',
        name: 'Create Slot',
        params: [
          { key: 'day', label: 'Day', placeholder: 'Monday' },
          { key: 'startTime', label: 'Start Time', placeholder: '09:00' },
          { key: 'endTime', label: 'End Time', placeholder: '17:00' },
          {
            key: 'consultationType',
            label: 'Type',
            placeholder: 'VIDEO | HOME | CLINIC',
          },
        ],
        description: 'POST /doctors/availability',
        module: 'doctorAvailability',
      },
      {
        method: 'DELETE',
        name: 'Delete Slot',
        params: [{ key: 'id', label: 'Slot ID' }],
        description: 'DELETE /doctors/availability/{id}',
        module: 'doctorAvailability',
      },
      {
        method: 'PATCH',
        name: 'Update Settings',
        params: [
          {
            key: 'sameTiming',
            label: 'Same Timing',
            type: 'number',
            placeholder: '0 or 1',
          },
          {
            key: 'availability',
            label: 'Status',
            placeholder: 'ACTIVE | INACTIVE',
          },
        ],
        description: 'PATCH /doctors/availability/settings',
        module: 'doctorAvailability',
      },
    ],
  },
  {
    key: 'healthcareAppointments',
    label: 'Appointments',
    endpoints: [
      {
        method: 'GET',
        name: 'Appointments',
        params: [],
        description: 'GET /healthcare/appointments',
        module: 'healthcareAppointments',
      },
      {
        method: 'GET',
        name: 'Single Appointment',
        params: [{ key: 'id', label: 'Appointment ID', type: 'number' }],
        description: 'GET /healthcare/appointments/{id}',
        module: 'healthcareAppointments',
      },
      {
        method: 'POST',
        name: 'Create Appointment',
        params: [],
        description: 'POST /healthcare/appointments (sample)',
        module: 'healthcareAppointments',
      },
      {
        method: 'PATCH',
        name: 'Cancel Appointment',
        params: [
          { key: 'id', label: 'Appointment ID', type: 'number' },
          { key: 'reason', label: 'Cancel Reason' },
        ],
        description: 'PATCH /healthcare/appointments/{id}/cancel',
        module: 'healthcareAppointments',
      },
      {
        method: 'PATCH',
        name: 'Reschedule Appointment',
        params: [
          { key: 'id', label: 'Appointment ID', type: 'number' },
          { key: 'appointmentDate', label: 'Date', placeholder: 'YYYY-MM-DD' },
          { key: 'appointmentTime', label: 'Time', placeholder: 'hh:mm A' },
          {
            key: 'appointmentEndTime',
            label: 'End Time',
            placeholder: 'hh:mm A',
          },
        ],
        description: 'PATCH /healthcare/appointments/{id}/reschedule',
        module: 'healthcareAppointments',
      },
      {
        method: 'PATCH',
        name: 'Update Status',
        params: [
          { key: 'id', label: 'Appointment ID', type: 'number' },
          {
            key: 'status',
            label: 'Status',
            placeholder: 'COMPLETED | CANCELLED',
          },
        ],
        description: 'PATCH /healthcare/appointments/{id}/status',
        module: 'healthcareAppointments',
      },
    ],
  },
  {
    key: 'hospital',
    label: 'Hospital',
    endpoints: [
      {
        method: 'GET',
        name: 'Dashboard',
        params: [],
        description: 'GET /hospitals/dashboard',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'System Services',
        params: [],
        description: 'GET /hospitals/system-services',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Doctors',
        params: [],
        description: 'GET /hospitals/doctors',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Single Doctor',
        params: [{ key: 'doctorId', label: 'Doctor ID' }],
        description: 'GET /hospitals/doctors/{doctorId}',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Agents',
        params: [],
        description: 'GET /hospitals/agents',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Agent Stats',
        params: [{ key: 'agentId', label: 'Agent ID' }],
        description: 'GET /hospitals/agents/{agentId}/stats',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Patients',
        params: [],
        description: 'GET /hospitals/patients',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Appointments',
        params: [],
        description: 'GET /hospitals/appointments',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Services',
        params: [],
        description: 'GET /hospitals/services',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Roles',
        params: [],
        description: 'GET /hospitals/roles',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Permissions',
        params: [],
        description: 'GET /hospitals/permissions',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Operating Hours',
        params: [],
        description: 'GET /hospitals/operating-hours',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Payout Settings',
        params: [],
        description: 'GET /hospitals/payout-settings',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Team',
        params: [],
        description: 'GET /hospitals/team',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Hospital Discovery',
        params: [],
        description: 'GET /hospitals-discovery',
        module: 'hospital',
      },
      {
        method: 'GET',
        name: 'Single Hospital',
        params: [{ key: 'hospitalId', label: 'Hospital ID' }],
        description: 'GET /hospitals-discovery/{id}',
        module: 'hospital',
      },
      {
        method: 'POST',
        name: 'Assign Doctor',
        params: [{ key: 'doctorId', label: 'Doctor ID' }],
        description: 'POST /hospitals/doctors/assign',
        module: 'hospital',
      },
      {
        method: 'POST',
        name: 'Invite Doctor',
        params: [
          { key: 'fullName', label: 'Full Name', placeholder: 'Dr. John' },
          { key: 'email', label: 'Email', placeholder: 'doctor@hospital.com' },
          { key: 'phone', label: 'Phone', placeholder: '+234800000000' },
          {
            key: 'frontendUrl',
            label: 'Frontend URL',
            placeholder: 'https://example.com/accept-invite',
          },
        ],
        description: 'POST /hospitals/doctors/invite',
        module: 'hospital',
      },
      {
        method: 'POST',
        name: 'Add Service',
        params: [{ key: 'serviceId', label: 'Service ID', type: 'number' }],
        description: 'POST /hospitals/services',
        module: 'hospital',
      },
      {
        method: 'POST',
        name: 'Create Agent',
        params: [
          { key: 'firstName', label: 'First Name' },
          { key: 'lastName', label: 'Last Name' },
          { key: 'email', label: 'Email', placeholder: 'agent@hospital.com' },
          { key: 'password', label: 'Password', type: 'password' },
        ],
        description: 'POST /hospitals/agents',
        module: 'hospital',
      },
      {
        method: 'POST',
        name: 'Assign Specialty',
        params: [
          { key: 'agentId', label: 'Agent ID' },
          { key: 'categoryId', label: 'Category ID (optional)' },
        ],
        description: 'POST /hospitals/agents/{agentId}/assign-specialty',
        module: 'hospital',
      },
      {
        method: 'POST',
        name: 'Assign Doctor To Agent',
        params: [
          { key: 'agentId', label: 'Agent ID' },
          { key: 'doctorId', label: 'Doctor ID' },
        ],
        description: 'POST /hospitals/agents/{agentId}/assign-doctor',
        module: 'hospital',
      },
      {
        method: 'POST',
        name: 'Add Team Member',
        params: [
          { key: 'fullName', label: 'Full Name' },
          { key: 'email', label: 'Email' },
          { key: 'roleId', label: 'Role ID', type: 'number' },
          {
            key: 'frontendUrl',
            label: 'Frontend URL',
            placeholder: 'https://example.com/accept-invite',
          },
        ],
        description: 'POST /hospitals/team',
        module: 'hospital',
      },
      {
        method: 'POST',
        name: 'Accept Invite',
        params: [{ key: 'token', label: 'Invite Token' }],
        description: 'POST /hospitals/team/accept-invite',
        module: 'hospital',
      },
      {
        method: 'POST',
        name: 'Create Role',
        params: [{ key: 'name', label: 'Role Name' }],
        description: 'POST /hospitals/roles',
        module: 'hospital',
      },
      {
        method: 'POST',
        name: 'Create Operating Hours',
        params: [],
        description: 'POST /hospitals/operating-hours (sample)',
        module: 'hospital',
      },
      {
        method: 'PATCH',
        name: 'Update Role',
        params: [
          { key: 'roleId', label: 'Role ID', type: 'number' },
          { key: 'name', label: 'New Role Name' },
        ],
        description: 'PUT /hospitals/roles/{roleId}',
        module: 'hospital',
      },
      {
        method: 'PATCH',
        name: 'Update Profile',
        params: [
          { key: 'name', label: 'Name (optional)' },
          { key: 'email', label: 'Email (optional)' },
          { key: 'phone', label: 'Phone (optional)' },
          { key: 'address', label: 'Address (optional)' },
        ],
        description: 'PUT /hospitals/profile',
        module: 'hospital',
      },
      {
        method: 'PATCH',
        name: 'Update Payout',
        params: [],
        description: 'PUT /hospitals/payout-settings (sample)',
        module: 'hospital',
      },
      {
        method: 'PATCH',
        name: 'Assign To Dept',
        params: [
          { key: 'doctorId', label: 'Doctor ID', type: 'number' },
          { key: 'departmentId', label: 'Department ID', type: 'number' },
        ],
        description: 'PUT /hospitals/doctors/{doctorId}/department',
        module: 'hospital',
      },
      {
        method: 'PATCH',
        name: 'Update Team Role',
        params: [
          { key: 'userId', label: 'User ID' },
          { key: 'roleId', label: 'Role ID', type: 'number' },
        ],
        description: 'PUT /hospitals/team/{userId}/role',
        module: 'hospital',
      },
      {
        method: 'DELETE',
        name: 'Delete Role',
        params: [{ key: 'roleId', label: 'Role ID', type: 'number' }],
        description: 'DELETE /hospitals/roles/{roleId}',
        module: 'hospital',
      },
    ],
  },
  {
    key: 'payment',
    label: 'Payment',
    endpoints: [
      {
        method: 'POST',
        name: 'Initialize Payment',
        params: [
          { key: 'amount', label: 'Amount', type: 'number' },
          { key: 'email', label: 'Email' },
          { key: 'callbackUrl', label: 'Callback URL' },
        ],
        description: 'POST /payment/initialize',
        module: 'payment',
      },
      {
        method: 'POST',
        name: 'Pay With Wallet',
        params: [
          { key: 'amount', label: 'Amount', type: 'number' },
          { key: 'email', label: 'Email' },
          { key: 'callbackUrl', label: 'Callback URL' },
        ],
        description: 'POST /payment/wallet/pay',
        module: 'payment',
      },
    ],
  },
  {
    key: 'users',
    label: 'Users',
    endpoints: [
      {
        method: 'GET',
        name: 'Profile',
        params: [],
        description: 'GET /auth/profile',
        module: 'users',
      },
      {
        method: 'POST',
        name: 'Update Profile',
        params: [{ key: 'firstName', label: 'First Name (optional)' }],
        description: 'PATCH /users/profile (partial)',
        module: 'users',
      },
      {
        method: 'POST',
        name: 'Upload Photo',
        params: [],
        description: 'POST /users/upload-photo (requires file)',
        module: 'users',
      },
    ],
  },
  {
    key: 'wallet',
    label: 'Wallet',
    endpoints: [
      {
        method: 'GET',
        name: 'Banks',
        params: [],
        description: 'GET /wallet/list-banks',
        module: 'wallet',
      },
      {
        method: 'GET',
        name: 'Balance',
        params: [],
        description: 'GET /wallet/balance',
        module: 'wallet',
      },
      {
        method: 'GET',
        name: 'Transactions',
        params: [],
        description: 'GET /wallet/transactions',
        module: 'wallet',
      },
      {
        method: 'GET',
        name: 'Payouts',
        params: [],
        description: 'GET /wallet/payouts',
        module: 'wallet',
      },
      {
        method: 'GET',
        name: 'Bank Accounts',
        params: [],
        description: 'GET /wallet/bank-accounts',
        module: 'wallet',
      },
      {
        method: 'POST',
        name: 'Add Bank Account',
        params: [
          { key: 'bankId', label: 'Bank ID', type: 'number' },
          { key: 'name', label: 'Account Name' },
          { key: 'bankName', label: 'Bank Name' },
          { key: 'accountNumber', label: 'Account Number' },
        ],
        description: 'POST /wallet/bank-accounts',
        module: 'wallet',
      },
      {
        method: 'POST',
        name: 'Verify Bank Account',
        params: [
          { key: 'bankId', label: 'Bank ID', type: 'number' },
          { key: 'accountNumber', label: 'Account Number' },
        ],
        description: 'POST /wallet/verify-bank-account',
        module: 'wallet',
      },
      {
        method: 'DELETE',
        name: 'Delete Bank Account',
        params: [{ key: 'id', label: 'Account ID', type: 'number' }],
        description: 'DELETE /wallet/bank-accounts/{id}',
        module: 'wallet',
      },
      {
        method: 'PATCH',
        name: 'Update Primary Account',
        params: [{ key: 'id', label: 'Account ID', type: 'number' }],
        description: 'PATCH /wallet/bank-accounts/{id}',
        module: 'wallet',
      },
    ],
  },
  {
    key: 'chat',
    label: 'Chat',
    endpoints: [
      {
        method: 'GET',
        name: 'Conversations',
        params: [],
        description: 'GET /chat/list',
        module: 'chat',
      },
      {
        method: 'GET',
        name: 'Chat History',
        params: [
          { key: 'peerId', label: 'Peer ID' },
          { key: 'lastId', label: 'Last Message ID (optional)' },
        ],
        description: 'GET /chat/history/{peerId}',
        module: 'chat',
      },
      {
        method: 'POST',
        name: 'Send Message',
        params: [
          { key: 'receiverId', label: 'Receiver ID', type: 'number' },
          { key: 'message', label: 'Message' },
        ],
        description: 'POST /chat/send',
        module: 'chat',
      },
      {
        method: 'PATCH',
        name: 'Mark Read',
        params: [{ key: 'peerId', label: 'Peer ID' }],
        description: 'PUT /chat/read/{peerId}',
        module: 'chat',
      },
    ],
  },
  {
    key: 'notifications',
    label: 'Notifications',
    endpoints: [
      {
        method: 'GET',
        name: 'Get Notifications',
        params: [
          {
            key: 'page',
            label: 'Page',
            type: 'number',
            placeholder: '1',
          },
          {
            key: 'limit',
            label: 'Limit',
            type: 'number',
            placeholder: '20',
          },
        ],
        description: 'GET /notifications',
        module: 'notifications',
      },
      {
        method: 'POST',
        name: 'Read All',
        params: [],
        description: 'POST /notifications/read-all',
        module: 'notifications',
      },
      {
        method: 'PATCH',
        name: 'Read Notification',
        params: [{ key: 'id', label: 'Notification ID' }],
        description: 'PATCH /notifications/{id}/read',
        module: 'notifications',
      },
    ],
  },
  {
    key: 'communication',
    label: 'Communication',
    endpoints: [
      {
        method: 'POST',
        name: 'Create Twilio Room',
        params: [],
        description: 'POST /communication/twilio/room',
        module: 'communication',
      },
      {
        method: 'GET',
        name: 'Twilio Token',
        params: [{ key: 'roomName', label: 'Room Name' }],
        description: 'GET /communication/twilio/token',
        module: 'communication',
      },
      {
        method: 'GET',
        name: 'Agora Token',
        params: [
          { key: 'channelName', label: 'Channel Name' },
          { key: 'uid', label: 'User ID', type: 'number' },
        ],
        description: 'GET /communication/agora-token',
        module: 'communication',
      },
      {
        method: 'POST',
        name: 'Send SMS',
        params: [
          { key: 'to', label: 'Phone Number', placeholder: '+2348012345678' },
          { key: 'message', label: 'Message' },
        ],
        description: 'POST /communication/sms',
        module: 'communication',
      },
    ],
  },
];

const allEndpoints = modules.flatMap((m) => m.endpoints);
const methods: Method[] = ['GET', 'POST', 'PATCH', 'DELETE'];

const moduleOptions = modules.map((m) => ({
  value: m.key,
  label: m.label,
}));

const executeApi = async (callKey: string, params: Record<string, string>) => {
  switch (callKey) {
    // Auth
    case 'auth_Login':
      return login({ email: params.email, password: params.password });
    case 'auth_Signup':
      return signup({
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        password: params.password,
        accountType: params.accountType as
          | 'HOSPITAL'
          | 'SEEKER'
          | 'DOCTOR'
          | 'AGENT'
          | 'ADMIN',
      });
    case 'auth_Forgot Password':
      return forgotPassword({ email: params.email });
    case 'auth_Verify Forgot OTP':
      return verifyForgotPasswordOtp({
        email: params.email,
        code: params.code,
      });
    case 'auth_Reset Password':
      return resetPassword({ newPassword: params.newPassword, token: '' });
    case 'auth_Verify Email':
      return verifyEmail({ email: params.email, code: params.code });
    case 'auth_Resend OTP':
      return resendOtp({ email: params.email, reason: params.reason });
    case 'auth_Change Password':
      return changePassword({
        oldPassword: params.oldPassword,
        newPassword: params.newPassword,
      });
    case 'auth_Complete Registration':
      return completeRegistration({
        categoryId: Number(params.categoryId),
        accountType: params.accountType as
          | 'HOSPITAL'
          | 'SEEKER'
          | 'DOCTOR'
          | 'AGENT'
          | 'ADMIN',
      });
    case 'auth_Social Login':
      return socialLogin({
        provider: params.provider as 'google' | 'apple' | 'facebook',
        accessToken: params.accessToken || undefined,
        idToken: params.idToken || undefined,
      });

    // Categories
    case 'categories_Account Types':
      return getAccountTypes();
    case 'categories_Categories':
      return getCategories({ type: params.type as 'DOCTOR' | 'HOSPITAL' });

    // Doctor
    case 'doctor_Doctor Discovery':
      return getDoctorsDiscovery();
    case 'doctor_Single Doctor':
      return getSingleDoctorProfile({ id: Number(params.doctorId) });
    case 'doctor_Doctor Profile':
      return getDoctorProfile();
    case 'doctor_Update Bio':
      return updateDoctorProfile({
        aboutUs: params.aboutUs,
        subcategoryId: Number(params.subcategoryId),
        feesMinute: Number(params.feesMinute),
        feesHour: Number(params.feesHour),
        clinicConsultationCharge: Number(params.clinicConsultationCharge),
        videoConsultationCharge: Number(params.videoConsultationCharge),
        homeConsultationCharge: Number(params.homeConsultationCharge),
        clinicName: params.clinicName,
        clinicState: params.clinicState,
        clinicCountry: params.clinicCountry,
        practicingLicenceDate: params.practicingLicenceDate,
        university: params.university,
        yearGraduated: params.yearGraduated,
        yearsOfExperience: params.yearsOfExperience,
        address: params.address,
        clinicPlace: params.clinicPlace,
        latitude: Number(params.latitude),
        longitude: Number(params.longitude),
        urgentCriteria:
          (params.urgentCriteria?.split(',').map((s: string) => s.trim()) as (
            | 'VIDEO'
            | 'HOME'
          )[]) || [],
      });
    case 'doctor_Upload Certification':
      return {
        error:
          'Upload Certification requires File inputs — not available in playground',
      };
    case 'doctor_Hospital Invitations':
      return getHospitalInvitations();
    case 'doctor_Accept Invitation':
      return acceptHospitalInvitation({ id: params.id });

    // Doctor Appointments
    case 'doctorAppointments_Appointments':
      return getDoctorAppointments({
        page: params.page ? Number(params.page) : 1,
        limit: params.limit ? Number(params.limit) : 20,
        filter:
          (params.filter as 'all' | 'upcoming' | 'completed' | 'cancelled') ||
          undefined,
        hospitalId: params.hospitalId || undefined,
      });
    case 'doctorAppointments_Stats':
      return getDoctorAppointmentStats();
    case 'doctorAppointments_Single Appointment':
      return getDoctorAppointment({ id: Number(params.id) });
    case 'doctorAppointments_Accept':
      return acceptDoctorAppointment({ id: params.id });
    case 'doctorAppointments_Decline':
      return declineDoctorAppointment({
        id: Number(params.id),
        reason: params.reason,
      });
    case 'doctorAppointments_Cancel':
      return cancelDoctorAppointment({
        id: Number(params.id),
        reason: params.reason,
      });
    case 'doctorAppointments_Start':
      return startDoctorAppointment({ id: params.id });
    case 'doctorAppointments_Complete':
      return completeDoctorAppointment({ id: params.id });
    case 'doctorAppointments_Consultation Notes':
      return submitDoctorConsultationNotes({
        id: params.id,
        diagnostic: params.diagnostic,
        symptomsObserved: params.symptomsObserved,
        prescription: params.prescription,
        followUpInstructions: params.followUpInstructions,
      });
    case 'doctorAppointments_Reschedule':
      return rescheduleDoctorAppointment({
        id: params.id,
        appointmentDate: params.appointmentDate,
        appointmentTime: params.appointmentTime,
      });

    // Doctor Availability
    case 'doctorAvailability_Availability':
      return getDoctorAvailability();
    case 'doctorAvailability_Create Slot':
      return createAvailabilitySlot({
        day: params.day,
        startTime: params.startTime,
        endTime: params.endTime,
        consultationType: params.consultationType as
          | 'VIDEO'
          | 'HOME'
          | 'CLINIC',
      });
    case 'doctorAvailability_Delete Slot':
      return deleteAvailabilitySlot({ id: params.id });
    case 'doctorAvailability_Update Settings':
      return updateAvailabilitySettings({
        sameTiming: Number(params.sameTiming),
        availability: params.availability as 'ACTIVE' | 'INACTIVE',
      });

    // Healthcare Appointments
    case 'healthcareAppointments_Appointments':
      return getAppointments();
    case 'healthcareAppointments_Single Appointment':
      return getAppointment({ id: Number(params.id) });
    case 'healthcareAppointments_Create Appointment':
      return createAppointment({
        userId: 1,
        myAppointment: 1,
        appointmentType: 'VIDEO',
        urgent: 0,
        name: 'Test User',
        email: 'test@example.com',
        mobileNo: '+234800000000',
        age: '30',
        gender: 'MALE',
        reason: 'Test appointment',
        appointmentDate: '2026-06-20',
        appointmentTime: '10:00 AM',
        appointmentEndTime: '10:30 AM',
        address: 'Test Address',
        city: 'Test City',
        country: 'Nigeria',
        duration: 30,
      });
    case 'healthcareAppointments_Cancel Appointment':
      return cancelAppointment({
        id: Number(params.id),
        reason: params.reason,
      });
    case 'healthcareAppointments_Reschedule Appointment':
      return rescheduleAppointment({
        id: Number(params.id),
        appointmentDate: params.appointmentDate,
        appointmentTime: params.appointmentTime,
        appointmentEndTime: params.appointmentEndTime,
      });
    case 'healthcareAppointments_Update Status':
      return updateAppointmentStatus({
        id: Number(params.id),
        status: params.status as 'COMPLETED' | 'CANCELLED',
      });

    // Hospital
    case 'hospital_Dashboard':
      return getHospitalDashboard();
    case 'hospital_System Services':
      return getHospitalSystemServices();
    case 'hospital_Doctors':
      return getHospitalDoctors();
    case 'hospital_Single Doctor':
      return getSingleDoctor({ doctorId: params.doctorId });
    case 'hospital_Agents':
      return getHospitalAgents();
    case 'hospital_Agent Stats':
      return getHospitalAgentStats({ agentId: params.agentId });
    case 'hospital_Patients':
      return getHospitalPatients();
    case 'hospital_Appointments':
      return getHospitalAppointments();
    case 'hospital_Services':
      return getHospitalServices();
    case 'hospital_Roles':
      return getHospitalRoles();
    case 'hospital_Permissions':
      return getHospitalPermissions();
    case 'hospital_Operating Hours':
      return getHospitalOperatingHours();
    case 'hospital_Payout Settings':
      return getHospitalPayoutSettings();
    case 'hospital_Team':
      return getHospitalTeam();
    case 'hospital_Hospital Discovery':
      return getHospitalDiscovery({ page: 1, limit: 10 });
    case 'hospital_Single Hospital':
      return getSingleHospital({ id: Number(params.hospitalId) });
    case 'hospital_Assign Doctor':
      return assignDoctor({ doctorId: params.doctorId });
    case 'hospital_Invite Doctor':
      return inviteDoctor({
        fullName: params.fullName,
        email: params.email,
        phone: params.phone,
        frontendUrl: params.frontendUrl,
      });
    case 'hospital_Add Service':
      return addServiceToHospital({ serviceId: Number(params.serviceId) });
    case 'hospital_Create Agent':
      return createHospitalAgent({
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        password: params.password,
      });
    case 'hospital_Assign Specialty':
      return assignSpecialtyToAgent({
        agentId: params.agentId,
        categoryId: params.categoryId || undefined,
      });
    case 'hospital_Assign Doctor To Agent':
      return assignDoctorToAgent({
        agentId: params.agentId,
        doctorId: params.doctorId,
      });
    case 'hospital_Add Team Member':
      return addTeamMember({
        fullName: params.fullName,
        email: params.email,
        roleId: Number(params.roleId),
        frontendUrl: params.frontendUrl,
      });
    case 'hospital_Accept Invite':
      return acceptTeamInvite({ token: params.token });
    case 'hospital_Create Role':
      return createHospitalRole({ name: params.name, permissions: [] });
    case 'hospital_Create Operating Hours':
      return createHospitalOperatingHours({
        hours: [
          {
            day: 'monday',
            startTime: '09:00',
            endTime: '17:00',
            consultationType: 'CLINIC',
          },
        ],
      });
    case 'hospital_Update Role':
      return updateHospitalRole({
        roleId: Number(params.roleId),
        name: params.name,
        permissions: [],
      });
    case 'hospital_Update Profile':
      return updateHospitalProfile({
        name: params.name || undefined,
        email: params.email || undefined,
        phone: params.phone || undefined,
        address: params.address || undefined,
      });
    case 'hospital_Update Payout':
      return updateHospitalPayoutSettings({
        payoutMethod: 'PLATFORM_MANAGED',
        videoConsultationFee: 100,
        clinicConsultationFee: 200,
        homeConsultationFee: 150,
        doctorPayoutPercentage: 70,
      });
    case 'hospital_Assign To Dept':
      return assignDoctorToDepartment({
        doctorId: Number(params.doctorId),
        departmentId: Number(params.departmentId),
      });
    case 'hospital_Update Team Role':
      return updateTeamMemberRole({
        userId: params.userId,
        roleId: Number(params.roleId),
      });
    case 'hospital_Delete Role':
      return deleteHospitalRole({ roleId: Number(params.roleId) });

    // Payment
    case 'payment_Initialize Payment':
      return initializePayment({
        amount: Number(params.amount),
        email: params.email,
        callbackUrl: params.callbackUrl,
      });
    case 'payment_Pay With Wallet':
      return payWithWallet({
        amount: Number(params.amount),
        email: params.email,
        callbackUrl: params.callbackUrl,
      });

    // Users
    case 'users_Profile':
      return getProfile();
    case 'users_Update Profile':
      return updateUserProfile({ firstName: params.firstName || undefined });
    case 'users_Upload Photo':
      return {
        error:
          'Upload Photo requires a File input — not available in playground',
      };

    // Wallet
    case 'wallet_Banks':
      return getBanks();
    case 'wallet_Balance':
      return getWalletBalance();
    case 'wallet_Transactions':
      return getWalletTransactions();
    case 'wallet_Payouts':
      return getPayouts();
    case 'wallet_Bank Accounts':
      return getBankAccounts();
    case 'wallet_Add Bank Account':
      return addBankAccount({
        bankId: Number(params.bankId),
        name: params.name,
        bankName: params.bankName,
        accountNumber: params.accountNumber,
      });
    case 'wallet_Verify Bank Account':
      return verifyBankAccount({
        bankId: Number(params.bankId),
        accountNumber: params.accountNumber,
      });
    case 'wallet_Delete Bank Account':
      return deleteBankAccount({ id: Number(params.id) });
    case 'wallet_Update Primary Account':
      return updatePrimaryAccount({ id: Number(params.id) });

    // Chat
    case 'chat_Conversations':
      return getConversations();
    case 'chat_Chat History':
      return getChatHistory({
        peerId: params.peerId,
      });
    case 'chat_Send Message':
      return sendMessage({
        receiverId: Number(params.receiverId),
        message: params.message,
      });
    case 'chat_Mark Read':
      return markChatRead({ peerId: params.peerId });

    // Notifications
    case 'notifications_Get Notifications':
      return getNotifications({
        page: params.page ? Number(params.page) : 1,
        limit: params.limit ? Number(params.limit) : 20,
      });
    case 'notifications_Read All':
      return readAllNotifications();
    case 'notifications_Read Notification':
      return readNotification({ id: params.id });

    // Communication
    case 'communication_Create Twilio Room':
      return createTwilioRoom();
    case 'communication_Twilio Token':
      return getTwilioToken({ roomName: params.roomName });
    case 'communication_Agora Token':
      return getAgoraToken({
        channelName: params.channelName,
        uid: Number(params.uid) || 1,
      });
    case 'communication_Send SMS':
      return sendSms({ to: params.to, message: params.message });

    default:
      throw new Error(`Unknown endpoint: ${callKey}`);
  }
};

const ApiPlayground = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [selectedModule, setSelectedModule] = useState<string>('hospital');
  const [method, setMethod] = useState<Method>('GET');
  const [response, setResponse] = useState<unknown>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === playgroundPassword) {
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-background p-4">
        <form
          onSubmit={handlePasswordSubmit}
          className="w-full max-w-sm bg-surface-card border border-gray-3 rounded-xl p-6 space-y-4"
        >
          <div>
            <h1 className="text-lg font-semibold text-text">API Playground</h1>
            <p className="text-sm text-text-muted mt-1">
              Enter the playground password to continue
            </p>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setPasswordError(false);
            }}
            className="w-full h-10 px-4 text-sm rounded-xl border border-gray-3 bg-surface-card text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
          />
          {passwordError && (
            <p className="text-xs text-error">Incorrect password</p>
          )}
          <Button
            type="submit"
            variant="primary"
            className="w-full h-10! text-sm!"
            disabled={!passwordInput}
          >
            Unlock
          </Button>
        </form>
      </div>
    );
  }

  const filtered = allEndpoints.filter(
    (e) => e.method === method && e.module === selectedModule
  );

  const handleParamChange = (key: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleExecute = async (ep: EndpointDef) => {
    const callKey = `${ep.module}_${ep.name}`;
    setLoading(callKey);
    setResponse(null);
    setActiveEndpoint(callKey);

    try {
      const args: Record<string, string> = {};
      ep.params.forEach((p) => {
        const val = paramValues[`${callKey}_${p.key}`];
        if (val) args[p.key] = val;
      });
      const result = await executeApi(callKey, args);
      setResponse(result);
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        data?: unknown;
        response?: { data?: unknown };
      };
      setResponse({
        error: err?.message || err?.data || 'Request failed',
        details: err?.response?.data || null,
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-7.5 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text">API Playground</h1>
        <p className="text-sm text-text-muted mt-1">
          Test endpoints from{' '}
          <code className="text-primary">src/apiQuery/</code>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-64">
          <Dropdown
            options={moduleOptions}
            value={selectedModule}
            onChange={(val) => {
              setSelectedModule(val as string);
              setActiveEndpoint(null);
              setResponse(null);
            }}
            placeholder="Select a module"
          />
        </div>

        <div className="flex gap-0.5 bg-gray-3a p-0.5 rounded-lg w-fit">
          {methods.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMethod(m);
                setActiveEndpoint(null);
                setResponse(null);
              }}
              className={cn(
                'px-5 py-2 text-sm font-medium rounded-md transition-colors',
                method === m
                  ? 'bg-surface-card text-text shadow-sm'
                  : 'text-text-muted hover:text-text'
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {filtered.map((ep) => (
          <div
            key={`${ep.module}_${ep.name}`}
            className={cn(
              'rounded-lg border p-4 transition-all',
              activeEndpoint === `${ep.module}_${ep.name}`
                ? 'border-primary bg-blue-3a'
                : 'border-gray-3 bg-surface-card hover:border-gray-5'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-text truncate">
                  {ep.name}
                </h3>
                <p className="text-xs text-text-muted mt-0.5 truncate">
                  {ep.description}
                </p>
              </div>
              <span
                className={cn(
                  'shrink-0 text-xs font-mono font-semibold px-2 py-0.5 rounded',
                  method === 'GET' && 'text-green-11 bg-green-3a',
                  method === 'POST' && 'text-blue-11a bg-blue-3a',
                  method === 'PATCH' && 'text-orange-10a bg-orange-3a',
                  method === 'DELETE' && 'text-error bg-error/10'
                )}
              >
                {method}
              </span>
            </div>

            {ep.params.length > 0 &&
              activeEndpoint === `${ep.module}_${ep.name}` && (
                <div className="mt-3 space-y-2">
                  {ep.params.map((p) => (
                    <input
                      key={`${ep.module}_${ep.name}_${p.key}`}
                      type={p.type || 'text'}
                      placeholder={p.placeholder || p.label}
                      value={
                        paramValues[`${ep.module}_${ep.name}_${p.key}`] || ''
                      }
                      onChange={(e) =>
                        handleParamChange(
                          `${ep.module}_${ep.name}_${p.key}`,
                          e.target.value
                        )
                      }
                      className="w-full h-8 px-3 text-xs rounded-md border border-gray-3 bg-surface-card text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
                    />
                  ))}
                </div>
              )}

            <Button
              variant="primary"
              className="mt-3 w-full h-8! text-xs!"
              loading={loading === `${ep.module}_${ep.name}`}
              onClick={() => handleExecute(ep)}
            >
              Execute
            </Button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-text-muted">
            No {method} endpoints in this module.
          </div>
        )}
      </div>

      {response !== null && (
        <div className="rounded-lg border border-gray-3 bg-surface-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-3">
            <h3 className="text-sm font-medium text-text">Response</h3>
            <button
              onClick={() => setResponse(null)}
              className="text-xs text-text-muted hover:text-text transition-colors"
            >
              Clear
            </button>
          </div>
          <pre className="p-4 text-xs text-text-alt overflow-auto max-h-96 font-mono leading-relaxed">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiPlayground;
