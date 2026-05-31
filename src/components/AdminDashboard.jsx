import { useState } from 'react';
import { sfx } from './SoundEffects';

export default function AdminDashboard({
  isOpen,
  onClose,
  portfolioData,
  onSave
}) {
  const [activeTab, setActiveTab] = useState('admin-prof');
  const [profile, setProfile] = useState({
    name: portfolioData?.profile?.name || '',
    bio: portfolioData?.profile?.bio || ''
  });
  const [education, setEducation] = useState(portfolioData?.education || []);
  const [experience, setExperience] = useState(portfolioData?.experience || []);
  const [organization, setOrganization] = useState(portfolioData?.organization || []);

  if (!isOpen) return null;

  const handleSave = () => {
    sfx.playClick();
    const cleanedExperience = experience.map(exp => ({
      ...exp,
      details: exp.details ? exp.details.map(d => d.trim()).filter(d => d !== '') : []
    }));
    onSave({
      profile,
      education,
      experience: cleanedExperience,
      organization
    });
  };

  // Education CRUD
  const handleAddEdu = () => {
    sfx.playClick();
    setEducation(prev => [
      ...prev,
      {
        year: '2025',
        title: 'New School/Institution',
        desc: 'New Degree Description',
        icon: 'ri-school-line',
        iconBg: 'bg-blue-100 dark:bg-blue-900',
        iconColor: 'text-blue-600 dark:text-blue-400'
      }
    ]);
  };

  const handleDeleteEdu = (idx) => {
    sfx.playClick();
    setEducation(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEduChange = (idx, field, val) => {
    setEducation(prev =>
      prev.map((edu, i) => (i === idx ? { ...edu, [field]: val } : edu))
    );
  };

  // Experience CRUD
  const handleAddExp = () => {
    sfx.playClick();
    const newId = `expWork${experience.length + 1}`;
    setExperience(prev => [
      ...prev,
      {
        id: newId,
        year: '2025',
        title: 'New Job Role',
        desc: 'Description overview...',
        icon: 'ri-code-box-line',
        color: 'blue',
        details: ['Key achievement 1', 'Key achievement 2']
      }
    ]);
  };

  const handleDeleteExp = (idx) => {
    sfx.playClick();
    setExperience(prev => prev.filter((_, i) => i !== idx));
  };

  const handleExpChange = (idx, field, val) => {
    setExperience(prev =>
      prev.map((exp, i) => {
        if (i === idx) {
          if (field === 'details') {
            return { ...exp, details: val.split('\n') };
          }
          return { ...exp, [field]: val };
        }
        return exp;
      })
    );
  };

  // Organization CRUD
  const handleAddOrg = () => {
    sfx.playClick();
    setOrganization(prev => [
      ...prev,
      {
        title: 'New Organization',
        role: 'Role Description',
        desc: 'Contributions description...',
        icon: 'ri-team-line',
        color: 'indigo'
      }
    ]);
  };

  const handleDeleteOrg = (idx) => {
    sfx.playClick();
    setOrganization(prev => prev.filter((_, i) => i !== idx));
  };

  const handleOrgChange = (idx, field, val) => {
    setOrganization(prev =>
      prev.map((org, i) => (i === idx ? { ...org, [field]: val } : org))
    );
  };

  // Export JSON
  const handleExport = () => {
    sfx.playTab();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ profile, education, experience, organization }, null, 2)
    );
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "portfolio_data.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  // Import JSON
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed.profile && parsed.education && parsed.experience) {
          setProfile(parsed.profile);
          setEducation(parsed.education);
          setExperience(parsed.experience);
          setOrganization(parsed.organization || []);
          sfx.playTab();
        } else {
          alert("Format JSON tidak valid!");
        }
      } catch {
        alert("Gagal membaca file JSON!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center z-[9999] sm:p-4">
      <div className="ios-blur ios-sheet sm:rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-gray-200/50 dark:border-gray-800/50">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <i className="ri-settings-5-line animate-spin-slow"></i> CRUD Admin Panel
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <i className="ri-download-2-line"></i> Export JSON
            </button>
            <label className="px-4 py-2 bg-indigo-500 hover:bg-indigo-650 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95">
              <i className="ri-upload-2-line"></i> Import JSON
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  handleImport(e);
                  e.target.value = '';
                }}
                className="hidden"
              />
            </label>
            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-500 hover:text-white transition-all text-gray-700 dark:text-gray-300"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {['Profile', 'Education', 'Experience', 'Organization'].map(tab => {
            const tabId = `admin-${tab.toLowerCase().substring(0, 4)}`;
            const targetTab = tab === 'Organization' ? 'admin-orgs' : tabId;
            return (
              <button
                key={tab}
                onClick={() => {
                  sfx.playTab();
                  setActiveTab(targetTab);
                }}
                className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === targetTab
                    ? 'bg-white dark:bg-gray-700 text-gray-850 dark:text-white shadow'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-250'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {/* Profile Content */}
          {activeTab === 'admin-prof' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Display Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-350 dark:border-gray-750 bg-transparent text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Short Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-350 dark:border-gray-750 bg-transparent text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
            </div>
          )}

          {/* Education Content */}
          {activeTab === 'admin-educ' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">Education Timeline</h4>
                <button
                  onClick={handleAddEdu}
                  className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  <i className="ri-add-line"></i> Add Item
                </button>
              </div>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                {education.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">Item #{idx+1}</span>
                      <button
                        onClick={() => handleDeleteEdu(idx)}
                        className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-0.5"
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Year"
                        value={edu.year}
                        onChange={e => handleEduChange(idx, 'year', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="School"
                        value={edu.title}
                        onChange={e => handleEduChange(idx, 'title', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-transparent text-sm sm:col-span-2 text-gray-800 dark:text-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Description"
                      value={edu.desc}
                      onChange={e => handleEduChange(idx, 'desc', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Content */}
          {activeTab === 'admin-expe' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">Work Experiences</h4>
                <button
                  onClick={handleAddExp}
                  className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  <i className="ri-add-line"></i> Add Card
                </button>
              </div>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                {experience.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-500 px-2 py-0.5 rounded bg-purple-500/10">Card #{idx+1}</span>
                      <button
                        onClick={() => handleDeleteExp(idx)}
                        className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-0.5"
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Year"
                        value={exp.year}
                        onChange={e => handleExpChange(idx, 'year', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Role Title"
                        value={exp.title}
                        onChange={e => handleExpChange(idx, 'title', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-transparent text-sm sm:col-span-2 text-gray-800 dark:text-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Short Summary"
                      value={exp.desc}
                      onChange={e => handleExpChange(idx, 'desc', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white"
                    />
                    <textarea
                      placeholder="Key bullets (one per line)"
                      value={exp.details ? exp.details.join('\n') : exp.desc}
                      onChange={e => handleExpChange(idx, 'details', e.target.value)}
                      rows={3}
                      className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organization Content */}
          {activeTab === 'admin-orgs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">Organization Activities</h4>
                <button
                  onClick={handleAddOrg}
                  className="px-3.5 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  <i className="ri-add-line"></i> Add Card
                </button>
              </div>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                {organization.map((org, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-500 px-2 py-0.5 rounded bg-orange-500/10">Card #{idx+1}</span>
                      <button
                        onClick={() => handleDeleteOrg(idx)}
                        className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-0.5"
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Organization Title"
                        value={org.title}
                        onChange={e => handleOrgChange(idx, 'title', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Role / Period"
                        value={org.role}
                        onChange={e => handleOrgChange(idx, 'role', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Brief description of contributions"
                      value={org.desc}
                      onChange={e => handleOrgChange(idx, 'desc', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg text-sm"
          >
            Save & Apply
          </button>
        </div>

      </div>
    </div>
  );
}
