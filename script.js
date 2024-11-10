document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resume-form');
    const addExperienceBtn = document.getElementById('add-experience');
    const addEducationBtn = document.getElementById('add-education');
    const generateResumeBtn = document.getElementById('generate-resume');
    const downloadResumeBtn = document.getElementById('download-resume');
    const resumePreview = document.getElementById('resume-preview');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    themeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const isDarkMode = body.classList.contains('dark-mode');
        themeIcon.innerHTML = isDarkMode
            ? '<i data-lucide="moon"></i>'
            : '<i data-lucide="sun"></i>';
        lucide.createIcons();
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    updateThemeIcon();

    addExperienceBtn.addEventListener('click', () => {
        const experienceFields = document.getElementById('experience-fields');
        const newExperience = document.createElement('div');
        newExperience.className = 'card';
        newExperience.innerHTML = `
            <input type="text" name="job-title[]" placeholder="Job Title" required>
            <input type="text" name="company[]" placeholder="Company" required>
            <input type="text" name="job-date[]" placeholder="Date Range" required>
            <textarea name="job-description[]" placeholder="Job Description" rows="3" required></textarea>
            <button type="button" class="btn-secondary remove-entry">Remove</button>
        `;
        experienceFields.appendChild(newExperience);
        addRemoveButtonListener(newExperience.querySelector('.remove-entry'));
    });

    addEducationBtn.addEventListener('click', () => {
        const educationFields = document.getElementById('education-fields');
        const newEducation = document.createElement('div');
        newEducation.className = 'card';
        newEducation.innerHTML = `
            <input type="text" name="degree[]" placeholder="Degree" required>
            <input type="text" name="school[]" placeholder="School" required>
            <input type="text" name="edu-date[]" placeholder="Graduation Year" required>
            <button type="button" class="btn-secondary remove-entry">Remove</button>
        `;
        educationFields.appendChild(newEducation);
        addRemoveButtonListener(newEducation.querySelector('.remove-entry'));
    });

    function addRemoveButtonListener(button) {
        button.addEventListener('click', function () {
            this.closest('.card').remove();
        });
    }

    generateResumeBtn.addEventListener('click', () => {
        const formData = new FormData(form);
        const resume = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            summary: formData.get('summary'),
            skills: formData.get('skills').split(',').map(skill => skill.trim()).filter(Boolean),
            experience: [],
            education: []
        };

        const jobTitles = formData.getAll('job-title[]');
        const companies = formData.getAll('company[]');
        const jobDates = formData.getAll('job-date[]');
        const jobDescriptions = formData.getAll('job-description[]');
        for (let i = 0; i < jobTitles.length; i++) {
            if (jobTitles[i]) {
                resume.experience.push({
                    jobTitle: jobTitles[i],
                    company: companies[i],
                    date: jobDates[i],
                    description: jobDescriptions[i]
                });
            }
        }

        const degrees = formData.getAll('degree[]');
        const schools = formData.getAll('school[]');
        const eduDates = formData.getAll('edu-date[]');
        for (let i = 0; i < degrees.length; i++) {
            if (degrees[i]) {
                resume.education.push({
                    degree: degrees[i],
                    school: schools[i],
                    date: eduDates[i]
                });
            }
        }

        updateResumePreview(resume);
    });

    function updateResumePreview(resume) {
        resumePreview.innerHTML = `
            <div class="resume-header">
                <h1>${resume.name}</h1>
                <p>${[resume.email, resume.phone, resume.location].filter(Boolean).join(' | ')}</p>
            </div>
            <div class="resume-summary">
                <h2>Professional Summary</h2>
                <p>${resume.summary}</p>
            </div>
            <div class="resume-skills">
                <h2>Skills</h2>
                <ul>
                    ${resume.skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            <div class="resume-experience">
                <h2>Work Experience</h2>
                ${resume.experience.map(exp => `
                    <div class="experience-item">
                        <h3>${exp.jobTitle}</h3>
                        <p>${exp.company} | ${exp.date}</p>
                        <p>${exp.description}</p>
                    </div>
                `).join('')}
            </div>
            <div class="resume-education">
                <h2>Education</h2>
                ${resume.education.map(edu => `
                    <div class="education-item">
                        <h3>${edu.degree}</h3>
                        <p>${edu.school} | ${edu.date}</p>
                    </div>
                `).join('')}
            </div>
        `;
        downloadResumeBtn.classList.remove('hidden');
    }

    downloadResumeBtn.addEventListener('click', () => {
        const resumeContent = resumePreview.innerHTML;
        const styles = `
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                h1 { color: #2c3e50; }
                h2 { color: #3498db; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
                .resume-header { text-align: center; margin-bottom: 20px; }
                .resume-skills ul { list-style-type: none; padding: 0; }
                .resume-skills li { display: inline-block; background-color: #3498db; color: white; padding: 5px 10px; margin: 2px; border-radius: 3px; }
                .experience-item, .education-item { margin-bottom: 15px; }
            </style>
        `;
        const fullContent = `<html><head>${styles}</head><body>${resumeContent}</body></html>`;
        const blob = new Blob([fullContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'resume.html';
        link.click();
        URL.revokeObjectURL(link.href);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
            generateResumeBtn.click();
        } else {
            alert('Please fill out all required fields.');
        }
    });

    document.querySelectorAll('.remove-entry').forEach(addRemoveButtonListener);

    form.addEventListener('input', () => {
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        localStorage.setItem('resumeFormData', JSON.stringify(formDataObj));
    });

    const savedFormData = localStorage.getItem('resumeFormData');
    if (savedFormData) {
        const formDataObj = JSON.parse(savedFormData);
        Object.keys(formDataObj).forEach(key => {
            const field = form.elements[key];
            if (field) {
                field.value = formDataObj[key];
            }
        });
    }
});