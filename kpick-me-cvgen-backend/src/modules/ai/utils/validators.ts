import { GeneratedCV } from '../types/cv-types';

export class CvValidators {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  static validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static validateDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}(-\d{2})?$/;
    return dateRegex.test(date);
  }

  static validateCV(cv: Partial<GeneratedCV>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!cv.personalInfo) {
      errors.push('Personal information is required');
    } else {
      if (!cv.personalInfo.fullName) {
        errors.push('Full name is required');
      }

      if (cv.personalInfo.email && !this.validateEmail(cv.personalInfo.email)) {
        errors.push('Invalid email format');
      }

      if (cv.personalInfo.phone && !this.validatePhone(cv.personalInfo.phone)) {
        errors.push('Invalid phone number format');
      }
    }

    if (cv.experience) {
      cv.experience.forEach((exp, index) => {
        if (!exp.company) errors.push(`Experience ${index + 1}: Company is required`);
        if (!exp.position) errors.push(`Experience ${index + 1}: Position is required`);
        if (!exp.startDate) errors.push(`Experience ${index + 1}: Start date is required`);
        if (!exp.endDate) errors.push(`Experience ${index + 1}: End date is required`);
        
        if (exp.startDate && !this.validateDate(exp.startDate)) {
          errors.push(`Experience ${index + 1}: Invalid start date format (use YYYY-MM)`);
        }
        if (exp.endDate && !this.validateDate(exp.endDate)) {
          errors.push(`Experience ${index + 1}: Invalid end date format (use YYYY-MM)`);
        }
      });
    }

    if (cv.education) {
      cv.education.forEach((edu, index) => {
        if (!edu.institution) errors.push(`Education ${index + 1}: Institution is required`);
        if (!edu.degree) errors.push(`Education ${index + 1}: Degree is required`);
        if (!edu.field) errors.push(`Education ${index + 1}: Field of study is required`);
        
        if (edu.startDate && !this.validateDate(edu.startDate)) {
          errors.push(`Education ${index + 1}: Invalid start date format`);
        }
        if (edu.endDate && !this.validateDate(edu.endDate)) {
          errors.push(`Education ${index + 1}: Invalid end date format`);
        }
      });
    }

    if (cv.projects) {
      cv.projects.forEach((proj, index) => {
        if (proj.link && !this.validateURL(proj.link)) {
          errors.push(`Project ${index + 1}: Invalid URL format`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static sanitizeHTML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  static cleanText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n');
  }
}

