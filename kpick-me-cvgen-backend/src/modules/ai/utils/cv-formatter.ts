import { GeneratedCV } from '../types/cv-types';

export class CvFormatter {
  static formatAsText(cv: GeneratedCV): string {
    let text = '';

    if (cv.personalInfo) {
      text += `${cv.personalInfo.fullName}\n`;
      if (cv.personalInfo.email) text += `${cv.personalInfo.email}\n`;
      if (cv.personalInfo.phone) text += `${cv.personalInfo.phone}\n`;
      if (cv.personalInfo.location) text += `${cv.personalInfo.location}\n`;
      text += '\n';

      if (cv.personalInfo.summary) {
        text += `PROFESSIONAL SUMMARY\n`;
        text += `${cv.personalInfo.summary}\n\n`;
      }
    }

    if (cv.experience && cv.experience.length > 0) {
      text += `WORK EXPERIENCE\n\n`;
      cv.experience.forEach((exp) => {
        text += `${exp.position}\n`;
        text += `${exp.company} | ${exp.startDate} - ${exp.endDate}\n`;
        text += `${exp.description}\n`;
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach((achievement) => {
            text += `• ${achievement}\n`;
          });
        }
        text += '\n';
      });
    }

    if (cv.education && cv.education.length > 0) {
      text += `EDUCATION\n\n`;
      cv.education.forEach((edu) => {
        text += `${edu.degree} in ${edu.field}\n`;
        text += `${edu.institution} | ${edu.startDate} - ${edu.endDate}\n`;
        if (edu.description) text += `${edu.description}\n`;
        text += '\n';
      });
    }

    if (cv.skills && cv.skills.length > 0) {
      text += `SKILLS\n`;
      text += `${cv.skills.join(' • ')}\n\n`;
    }

    if (cv.projects && cv.projects.length > 0) {
      text += `PROJECTS\n\n`;
      cv.projects.forEach((proj) => {
        text += `${proj.name}\n`;
        text += `${proj.description}\n`;
        text += `Technologies: ${proj.technologies.join(', ')}\n`;
        if (proj.link) text += `${proj.link}\n`;
        text += '\n';
      });
    }

    if (cv.certifications && cv.certifications.length > 0) {
      text += `CERTIFICATIONS\n\n`;
      cv.certifications.forEach((cert) => {
        text += `${cert.name} - ${cert.issuer} (${cert.date})\n`;
      });
      text += '\n';
    }

    if (cv.languages && cv.languages.length > 0) {
      text += `LANGUAGES\n\n`;
      cv.languages.forEach((lang) => {
        text += `${lang.name}: ${lang.proficiency}\n`;
      });
    }

    return text;
  }

  static formatAsHTML(cv: GeneratedCV): string {
    let html = '<html><head><meta charset="UTF-8"><style>';
    html += `
      body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
      h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
      h2 { color: #34495e; border-bottom: 2px solid #ecf0f1; padding-bottom: 5px; margin-top: 30px; }
      .contact { color: #7f8c8d; margin-bottom: 20px; }
      .job { margin-bottom: 20px; }
      .job-title { font-weight: bold; color: #2c3e50; }
      .job-company { color: #7f8c8d; font-style: italic; }
      ul { list-style-type: none; padding-left: 0; }
      li:before { content: "• "; color: #3498db; font-weight: bold; }
      .skills { display: flex; flex-wrap: wrap; gap: 10px; }
      .skill { background: #ecf0f1; padding: 5px 10px; border-radius: 3px; }
    `;
    html += '</style></head><body>';

    if (cv.personalInfo) {
      html += `<h1>${cv.personalInfo.fullName}</h1>`;
      html += '<div class="contact">';
      if (cv.personalInfo.email) html += `${cv.personalInfo.email} | `;
      if (cv.personalInfo.phone) html += `${cv.personalInfo.phone} | `;
      if (cv.personalInfo.location) html += cv.personalInfo.location;
      html += '</div>';

      if (cv.personalInfo.summary) {
        html += '<h2>Professional Summary</h2>';
        html += `<p>${cv.personalInfo.summary}</p>`;
      }
    }

    if (cv.experience && cv.experience.length > 0) {
      html += '<h2>Work Experience</h2>';
      cv.experience.forEach((exp) => {
        html += '<div class="job">';
        html += `<div class="job-title">${exp.position}</div>`;
        html += `<div class="job-company">${exp.company} | ${exp.startDate} - ${exp.endDate}</div>`;
        html += `<p>${exp.description}</p>`;
        if (exp.achievements && exp.achievements.length > 0) {
          html += '<ul>';
          exp.achievements.forEach((achievement) => {
            html += `<li>${achievement}</li>`;
          });
          html += '</ul>';
        }
        html += '</div>';
      });
    }

    if (cv.education && cv.education.length > 0) {
      html += '<h2>Education</h2>';
      cv.education.forEach((edu) => {
        html += `<div class="job">`;
        html += `<div class="job-title">${edu.degree} in ${edu.field}</div>`;
        html += `<div class="job-company">${edu.institution} | ${edu.startDate} - ${edu.endDate}</div>`;
        if (edu.description) html += `<p>${edu.description}</p>`;
        html += '</div>';
      });
    }

    if (cv.skills && cv.skills.length > 0) {
      html += '<h2>Skills</h2>';
      html += '<div class="skills">';
      cv.skills.forEach((skill) => {
        html += `<span class="skill">${skill}</span>`;
      });
      html += '</div>';
    }

    if (cv.projects && cv.projects.length > 0) {
      html += '<h2>Projects</h2>';
      cv.projects.forEach((proj) => {
        html += '<div class="job">';
        html += `<div class="job-title">${proj.name}</div>`;
        html += `<p>${proj.description}</p>`;
        html += `<p><strong>Technologies:</strong> ${proj.technologies.join(', ')}</p>`;
        if (proj.link) html += `<p><a href="${proj.link}">${proj.link}</a></p>`;
        html += '</div>';
      });
    }

    if (cv.certifications && cv.certifications.length > 0) {
      html += '<h2>Certifications</h2>';
      html += '<ul>';
      cv.certifications.forEach((cert) => {
        html += `<li>${cert.name} - ${cert.issuer} (${cert.date})</li>`;
      });
      html += '</ul>';
    }

    if (cv.languages && cv.languages.length > 0) {
      html += '<h2>Languages</h2>';
      html += '<ul>';
      cv.languages.forEach((lang) => {
        html += `<li>${lang.name}: ${lang.proficiency}</li>`;
      });
      html += '</ul>';
    }

    html += '</body></html>';
    return html;
  }

  static extractKeywords(cv: GeneratedCV): string[] {
    const keywords = new Set<string>();

    if (cv.skills) {
      cv.skills.forEach(skill => keywords.add(skill.toLowerCase()));
    }

    if (cv.experience) {
      cv.experience.forEach(exp => {
        if (exp.technologies) {
          exp.technologies.forEach(tech => keywords.add(tech.toLowerCase()));
        }
      });
    }

    if (cv.projects) {
      cv.projects.forEach(proj => {
        proj.technologies.forEach(tech => keywords.add(tech.toLowerCase()));
      });
    }

    return Array.from(keywords);
  }

  static calculateCompleteness(cv: GeneratedCV): number {
    let score = 0;
    const maxScore = 100;

    if (cv.personalInfo) {
      if (cv.personalInfo.fullName) score += 10;
      if (cv.personalInfo.email) score += 5;
      if (cv.personalInfo.phone) score += 5;
      if (cv.personalInfo.summary) score += 15;
    }

    if (cv.experience && cv.experience.length > 0) {
      score += 25;
      if (cv.experience.some(exp => exp.achievements && exp.achievements.length > 0)) {
        score += 10;
      }
    }

    if (cv.education && cv.education.length > 0) score += 15;
    if (cv.skills && cv.skills.length > 0) score += 10;
    if (cv.projects && cv.projects.length > 0) score += 5;

    return Math.min(score, maxScore);
  }
}

