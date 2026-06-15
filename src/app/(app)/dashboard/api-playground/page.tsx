'use client';

import { getHospitalDashboard } from '@/apiQuery/hospital';
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

import { assignDoctorToDepartment } from '@/apiQuery/hospital/patch/assignDoctorToDepartment';
import { updateHospitalPayoutSettings } from '@/apiQuery/hospital/patch/updatePayoutSettings';
import { updateHospitalProfile } from '@/apiQuery/hospital/patch/updateProfile';
import { updateHospitalRole } from '@/apiQuery/hospital/patch/updateRole';
import { updateTeamMemberRole } from '@/apiQuery/hospital/patch/updateTeamMemberRole';

import { deleteHospitalRole } from '@/apiQuery/hospital/delete/deleteRole';

import Button from '@/components/Ui/Button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
}

const endpoints: EndpointDef[] = [
  {
    method: 'GET',
    name: 'Dashboard',
    params: [],
    description: 'GET /hospitals/dashboard',
  },
  {
    method: 'GET',
    name: 'System Services',
    params: [],
    description: 'GET /hospitals/system-services',
  },
  {
    method: 'GET',
    name: 'Doctors',
    params: [],
    description: 'GET /hospitals/doctors',
  },
  {
    method: 'GET',
    name: 'Single Doctor',
    params: [{ key: 'doctorId', label: 'Doctor ID' }],
    description: 'GET /hospitals/doctors/{doctorId}',
  },
  {
    method: 'GET',
    name: 'Agents',
    params: [],
    description: 'GET /hospitals/agents',
  },
  {
    method: 'GET',
    name: 'Agent Stats',
    params: [{ key: 'agentId', label: 'Agent ID' }],
    description: 'GET /hospitals/agents/{agentId}/stats',
  },
  {
    method: 'GET',
    name: 'Patients',
    params: [],
    description: 'GET /hospitals/patients',
  },
  {
    method: 'GET',
    name: 'Appointments',
    params: [],
    description: 'GET /hospitals/appointments',
  },
  {
    method: 'GET',
    name: 'Services',
    params: [],
    description: 'GET /hospitals/services',
  },
  {
    method: 'GET',
    name: 'Roles',
    params: [],
    description: 'GET /hospitals/roles',
  },
  {
    method: 'GET',
    name: 'Permissions',
    params: [],
    description: 'GET /hospitals/permissions',
  },
  {
    method: 'GET',
    name: 'Operating Hours',
    params: [],
    description: 'GET /hospitals/operating-hours',
  },
  {
    method: 'GET',
    name: 'Payout Settings',
    params: [],
    description: 'GET /hospitals/payout-settings',
  },
  {
    method: 'GET',
    name: 'Team',
    params: [],
    description: 'GET /hospitals/team',
  },
  {
    method: 'GET',
    name: 'Hospital Discovery',
    params: [],
    description: 'GET /hospitals/discovery',
  },
  {
    method: 'GET',
    name: 'Single Hospital',
    params: [{ key: 'hospitalId', label: 'Hospital ID' }],
    description: 'GET /hospitals/{hospitalId}',
  },

  {
    method: 'POST',
    name: 'Assign Doctor',
    params: [{ key: 'doctorId', label: 'Doctor ID' }],
    description: 'POST /hospitals/doctors/assign',
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
  },
  {
    method: 'POST',
    name: 'Add Service',
    params: [{ key: 'serviceId', label: 'Service ID', type: 'number' }],
    description: 'POST /hospitals/services',
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
  },
  {
    method: 'POST',
    name: 'Assign Specialty',
    params: [
      { key: 'agentId', label: 'Agent ID' },
      { key: 'categoryId', label: 'Category ID (optional)' },
    ],
    description: 'POST /hospitals/agents/{agentId}/assign-specialty',
  },
  {
    method: 'POST',
    name: 'Assign Doctor To Agent',
    params: [
      { key: 'agentId', label: 'Agent ID' },
      { key: 'doctorId', label: 'Doctor ID' },
    ],
    description: 'POST /hospitals/agents/{agentId}/assign-doctor',
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
  },
  {
    method: 'POST',
    name: 'Accept Invite',
    params: [{ key: 'token', label: 'Invite Token' }],
    description: 'POST /hospitals/team/accept-invite',
  },
  {
    method: 'POST',
    name: 'Create Role',
    params: [{ key: 'name', label: 'Role Name' }],
    description: 'POST /hospitals/roles',
  },
  {
    method: 'POST',
    name: 'Create Operating Hours',
    params: [],
    description: 'POST /hospitals/operating-hours (sample data)',
  },

  {
    method: 'PATCH',
    name: 'Update Role',
    params: [
      { key: 'roleId', label: 'Role ID', type: 'number' },
      { key: 'name', label: 'New Role Name' },
    ],
    description: 'PUT /hospitals/roles/{roleId}',
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
  },
  {
    method: 'PATCH',
    name: 'Update Payout',
    params: [],
    description: 'PUT /hospitals/payout-settings (sample data)',
  },
  {
    method: 'PATCH',
    name: 'Assign To Dept',
    params: [
      { key: 'doctorId', label: 'Doctor ID', type: 'number' },
      { key: 'departmentId', label: 'Department ID', type: 'number' },
    ],
    description: 'PUT /hospitals/doctors/{doctorId}/department',
  },
  {
    method: 'PATCH',
    name: 'Update Team Role',
    params: [
      { key: 'userId', label: 'User ID' },
      { key: 'roleId', label: 'Role ID', type: 'number' },
    ],
    description: 'PUT /hospitals/team/{userId}/role',
  },

  {
    method: 'DELETE',
    name: 'Delete Role',
    params: [{ key: 'roleId', label: 'Role ID', type: 'number' }],
    description: 'DELETE /hospitals/roles/{roleId}',
  },
];

const methods: Method[] = ['GET', 'POST', 'PATCH', 'DELETE'];

const executeApi = async (name: string, params: Record<string, string>) => {
  switch (name) {
    case 'Dashboard':
      return getHospitalDashboard();
    case 'System Services':
      return getHospitalSystemServices();
    case 'Doctors':
      return getHospitalDoctors();
    case 'Single Doctor':
      return getSingleDoctor({ doctorId: params.doctorId });
    case 'Agents':
      return getHospitalAgents();
    case 'Agent Stats':
      return getHospitalAgentStats({ agentId: params.agentId });
    case 'Patients':
      return getHospitalPatients();
    case 'Appointments':
      return getHospitalAppointments();
    case 'Services':
      return getHospitalServices();
    case 'Roles':
      return getHospitalRoles();
    case 'Permissions':
      return getHospitalPermissions();
    case 'Operating Hours':
      return getHospitalOperatingHours();
    case 'Payout Settings':
      return getHospitalPayoutSettings();
    case 'Team':
      return getHospitalTeam();
    case 'Hospital Discovery':
      return getHospitalDiscovery({ page: 1, limit: 10 });
    case 'Single Hospital':
      return getSingleHospital({ id: Number(params.hospitalId) });

    case 'Assign Doctor':
      return assignDoctor({ doctorId: params.doctorId });
    case 'Invite Doctor':
      return inviteDoctor({
        fullName: params.fullName,
        email: params.email,
        phone: params.phone,
        frontendUrl: params.frontendUrl,
      });
    case 'Add Service':
      return addServiceToHospital({ serviceId: Number(params.serviceId) });
    case 'Create Agent':
      return createHospitalAgent({
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        password: params.password,
      });
    case 'Assign Specialty':
      return assignSpecialtyToAgent({
        agentId: params.agentId,
        categoryId: params.categoryId || undefined,
      });
    case 'Assign Doctor To Agent':
      return assignDoctorToAgent({
        agentId: params.agentId,
        doctorId: params.doctorId,
      });
    case 'Add Team Member':
      return addTeamMember({
        fullName: params.fullName,
        email: params.email,
        roleId: Number(params.roleId),
        frontendUrl: params.frontendUrl,
      });
    case 'Accept Invite':
      return acceptTeamInvite({ token: params.token });
    case 'Create Role':
      return createHospitalRole({ name: params.name, permissions: [] });
    case 'Create Operating Hours':
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

    case 'Update Role':
      return updateHospitalRole({
        roleId: Number(params.roleId),
        name: params.name,
        permissions: [],
      });
    case 'Update Profile':
      return updateHospitalProfile({
        name: params.name || undefined,
        email: params.email || undefined,
        phone: params.phone || undefined,
        address: params.address || undefined,
      });
    case 'Update Payout':
      return updateHospitalPayoutSettings({
        payoutMethod: 'PLATFORM_MANAGED',
        videoConsultationFee: 100,
        clinicConsultationFee: 200,
        homeConsultationFee: 150,
        doctorPayoutPercentage: 70,
      });
    case 'Assign To Dept':
      return assignDoctorToDepartment({
        doctorId: Number(params.doctorId),
        departmentId: Number(params.departmentId),
      });
    case 'Update Team Role':
      return updateTeamMemberRole({
        userId: params.userId,
        roleId: Number(params.roleId),
      });

    case 'Delete Role':
      return deleteHospitalRole({ roleId: Number(params.roleId) });
    default:
      throw new Error(`Unknown endpoint: ${name}`);
  }
};

const ApiPlayground = () => {
  const [method, setMethod] = useState<Method>('GET');
  const [response, setResponse] = useState<unknown>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);

  const filtered = endpoints.filter((e) => e.method === method);

  const handleParamChange = (key: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleExecute = async (ep: EndpointDef) => {
    setLoading(ep.name);
    setResponse(null);
    setActiveEndpoint(ep.name);

    try {
      const args: Record<string, string> = {};
      ep.params.forEach((p) => {
        const val = paramValues[`${ep.name}_${p.key}`];
        if (val) args[p.key] = val;
      });
      const result = await executeApi(ep.name, args);
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text">
          Hospital API Playground
        </h1>
        <p className="text-sm text-text-muted mt-1">
          All endpoints from{' '}
          <code className="text-primary">src/apiQuery/hospital/</code>
        </p>
      </div>

      <div className="flex gap-0.5 mb-6 bg-gray-3a p-0.5 rounded-lg w-fit">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {filtered.map((ep) => (
          <div
            key={ep.name}
            className={cn(
              'rounded-lg border p-4 transition-all',
              activeEndpoint === ep.name
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

            {ep.params.length > 0 && activeEndpoint === ep.name && (
              <div className="mt-3 space-y-2">
                {ep.params.map((p) => (
                  <input
                    key={p.key}
                    type={p.type || 'text'}
                    placeholder={p.placeholder || p.label}
                    value={paramValues[`${ep.name}_${p.key}`] || ''}
                    onChange={(e) =>
                      handleParamChange(`${ep.name}_${p.key}`, e.target.value)
                    }
                    className="w-full h-8 px-3 text-xs rounded-md border border-gray-3 bg-surface-card text-text placeholder:text-text-muted focus:outline-none focus:border-primary"
                  />
                ))}
              </div>
            )}

            <Button
              variant="primary"
              className="mt-3 w-full h-8! text-xs!"
              loading={loading === ep.name}
              onClick={() => handleExecute(ep)}
            >
              Execute
            </Button>
          </div>
        ))}
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
