import type { TasksFilters } from "../../../tasks/[querysync]/tasksQs.svelte";
import type { TasksAPIResponse } from "./+server.js";

// prettier-ignore
const DUMMY_TASKS = [
  { id: 1, title: "Complete project proposal", description: "Draft and finalize the Q3 project proposal document", completed: false },
  { id: 2, title: "Schedule team meeting", description: "Set up weekly sync for the development team", completed: true },
  { id: 3, title: "Review pull requests", description: "Review and merge outstanding PRs for the main branch", completed: false },
  { id: 4, title: "Update documentation", description: "Update API documentation with recent changes", completed: true },
  { id: 5, title: "Fix navigation bug", description: "Address the navigation issue reported in mobile view", completed: false },
  { id: 6, title: "Implement user feedback", description: "Add changes based on latest user testing session", completed: true },
  { id: 7, title: "Optimize database queries", description: "Improve performance of slow-running database operations", completed: false },
  { id: 8, title: "Create unit tests", description: "Write tests for the authentication module", completed: true },
  { id: 9, title: "Deploy to staging", description: "Push latest changes to the staging environment", completed: false },
  { id: 10, title: "Conduct code review", description: "Review code quality and suggest improvements", completed: true },
  { id: 11, title: "Update dependencies", description: "Update npm packages to latest versions", completed: false },
  { id: 12, title: "Design new dashboard", description: "Create mockups for the analytics dashboard", completed: false },
  { id: 13, title: "Implement dark mode", description: "Add dark mode support to the application", completed: true },
  { id: 14, title: "Fix memory leak", description: "Address memory leak in the image processing component", completed: false },
  { id: 15, title: "Prepare for demo", description: "Set up demo environment for client presentation", completed: true },
  { id: 16, title: "Refactor authentication logic", description: "Improve and simplify the authentication flow", completed: false },
  { id: 17, title: "Create user onboarding", description: "Design and implement user onboarding experience", completed: true },
  { id: 18, title: "Investigate performance issue", description: "Debug slow loading times on the dashboard", completed: false },
  { id: 19, title: "Set up CI/CD pipeline", description: "Configure automated testing and deployment", completed: true },
  { id: 20, title: "Implement search functionality", description: "Add search feature to the product catalog", completed: false },
  { id: 21, title: "Create data backup strategy", description: "Design and implement regular data backup procedures", completed: true },
  { id: 22, title: "Optimize image loading", description: "Implement lazy loading for product images", completed: false },
  { id: 23, title: "Add export feature", description: "Allow users to export data in CSV format", completed: true },
  { id: 24, title: "Fix form validation", description: "Address issues with form validation in checkout process", completed: false },
  { id: 25, title: "Implement notifications", description: "Add in-app notification system", completed: true },
  { id: 26, title: "Update privacy policy", description: "Review and update privacy policy for compliance", completed: false },
  { id: 27, title: "Create admin dashboard", description: "Build dashboard for administrative functions", completed: true },
  { id: 28, title: "Optimize for mobile", description: "Improve responsive design for mobile devices", completed: false },
  { id: 29, title: "Implement file uploads", description: "Add support for file uploads in the user profile", completed: true },
  { id: 30, title: "Fix checkout bug", description: "Address issue with payment processing in checkout", completed: false },
  { id: 31, title: "Create user guide", description: "Write comprehensive user documentation", completed: true },
  { id: 32, title: "Implement analytics", description: "Add tracking for key user interactions", completed: false },
  { id: 33, title: "Optimize API responses", description: "Reduce payload size of API responses", completed: true },
  { id: 34, title: "Add multi-language support", description: "Implement internationalization for the application", completed: false },
  { id: 35, title: "Conduct security audit", description: "Review application for security vulnerabilities", completed: true },
  { id: 36, title: "Implement caching", description: "Add caching layer to improve performance", completed: false },
  { id: 37, title: "Create email templates", description: "Design templates for system notification emails", completed: true },
  { id: 38, title: "Fix sorting functionality", description: "Address issues with list sorting in the UI", completed: false },
  { id: 39, title: "Implement pagination", description: "Add pagination to long lists of items", completed: true },
  { id: 40, title: "Update error handling", description: "Improve user-facing error messages", completed: false },
  { id: 41, title: "Create style guide", description: "Document UI components and usage guidelines", completed: true },
  { id: 42, title: "Implement social login", description: "Add support for login with social accounts", completed: false },
  { id: 43, title: "Optimize database schema", description: "Improve database structure for better performance", completed: true },
  { id: 44, title: "Add print functionality", description: "Allow users to print reports and invoices", completed: false },
  { id: 45, title: "Implement rate limiting", description: "Add protection against API abuse", completed: true },
  { id: 46, title: "Create data visualization", description: "Add charts and graphs for analytics data", completed: false },
  { id: 47, title: "Fix accessibility issues", description: "Improve application accessibility for screen readers", completed: true },
  { id: 48, title: "Implement webhooks", description: "Add support for external system notifications", completed: false },
  { id: 49, title: "Create API documentation", description: "Document API endpoints and usage", completed: true },
  { id: 50, title: "Optimize frontend bundle", description: "Reduce size of JavaScript bundles", completed: false },
  { id: 51, title: "Implement user roles", description: "Add role-based access control to the application", completed: true },
  { id: 52, title: "Fix date formatting", description: "Standardize date formats throughout the application", completed: false },
  { id: 53, title: "Add keyboard shortcuts", description: "Implement keyboard shortcuts for common actions", completed: true },
  { id: 54, title: "Create database indexes", description: "Add indexes to improve query performance", completed: false },
  { id: 55, title: "Implement auto-save", description: "Add auto-save functionality to forms", completed: true },
  { id: 56, title: "Fix image cropping", description: "Address issues with profile image cropping", completed: false },
  { id: 57, title: "Create error logging", description: "Implement centralized error logging system", completed: true },
  { id: 58, title: "Optimize CSS", description: "Reduce CSS file size and improve specificity", completed: false },
  { id: 59, title: "Implement two-factor authentication", description: "Add 2FA support for enhanced security", completed: true },
  { id: 60, title: "Fix sorting algorithm", description: "Improve performance of data sorting operations", completed: false },
  { id: 61, title: "Create user feedback form", description: "Add in-app mechanism for collecting user feedback", completed: true },
  { id: 62, title: "Implement data export", description: "Allow users to export their data in various formats", completed: false },
  { id: 63, title: "Fix password reset flow", description: "Improve the password reset user experience", completed: true },
  { id: 64, title: "Optimize server response times", description: "Improve backend performance for key operations", completed: false },
  { id: 65, title: "Create user preferences", description: "Implement user-configurable application settings", completed: true },
  { id: 66, title: "Fix notification delivery", description: "Address issues with delayed notification delivery", completed: false },
  { id: 67, title: "Implement content filtering", description: "Add filters for user-generated content", completed: true },
  { id: 68, title: "Create backup system", description: "Implement automated system backups", completed: false },
  { id: 69, title: "Fix search algorithm", description: "Improve relevance of search results", completed: true },
  { id: 70, title: "Implement activity log", description: "Add detailed logging of user activities", completed: false },
  { id: 71, title: "Create performance monitoring", description: "Set up monitoring for application performance", completed: true },
  { id: 72, title: "Fix data import", description: "Address issues with bulk data import functionality", completed: false },
  { id: 73, title: "Implement user blocking", description: "Add ability for admins to block problematic users", completed: true },
  { id: 74, title: "Create automated tests", description: "Implement end-to-end testing for critical flows", completed: false },
  { id: 75, title: "Fix comment system", description: "Address issues with nested comments display", completed: true },
  { id: 76, title: "Implement content scheduling", description: "Add ability to schedule content publication", completed: false },
  { id: 77, title: "Create user tutorials", description: "Develop interactive tutorials for new users", completed: true },
  { id: 78, title: "Fix data synchronization", description: "Address issues with offline data syncing", completed: false },
  { id: 79, title: "Implement content moderation", description: "Add tools for moderating user-generated content", completed: true },
  { id: 80, title: "Create system health dashboard", description: "Build monitoring dashboard for system status", completed: false },
  { id: 81, title: "Fix user profile updates", description: "Address issues with saving profile changes", completed: true },
  { id: 82, title: "Implement data validation", description: "Add comprehensive input validation", completed: false },
  { id: 83, title: "Create user achievements", description: "Implement gamification elements for user engagement", completed: true },
  { id: 84, title: "Fix email delivery", description: "Address issues with email deliverability", completed: false },
  { id: 85, title: "Implement content recommendations", description: "Add personalized content recommendation system", completed: true },
  { id: 86, title: "Create API rate limiting", description: "Implement controls to prevent API abuse", completed: false },
  { id: 87, title: "Fix session handling", description: "Improve session management and timeout handling", completed: true },
  { id: 88, title: "Implement data archiving", description: "Add functionality to archive old data", completed: false },
  { id: 89, title: "Create user groups", description: "Implement group functionality for collaboration", completed: true },
  { id: 90, title: "Fix permission system", description: "Address issues with permission inheritance", completed: false },
  { id: 91, title: "Implement content versioning", description: "Add version control for content changes", completed: true },
  { id: 92, title: "Create audit logs", description: "Implement detailed system audit logging", completed: false },
  { id: 93, title: "Fix file download", description: "Address issues with large file downloads", completed: true },
  { id: 94, title: "Implement custom reports", description: "Add user-configurable reporting functionality", completed: false },
  { id: 95, title: "Create user onboarding", description: "Design and implement new user onboarding flow", completed: true },
  { id: 96, title: "Fix data aggregation", description: "Address issues with statistical data aggregation", completed: false },
  { id: 97, title: "Implement content approval workflow", description: "Add approval process for content publication", completed: true },
  { id: 98, title: "Create system backups", description: "Implement automated backup procedures", completed: false },
  { id: 99, title: "Fix user notifications", description: "Address issues with notification preferences", completed: true },
  { id: 100, title: "Implement data encryption", description: "Add encryption for sensitive data storage", completed: false },
  { id: 101, title: "Create performance benchmarks", description: "Establish baseline performance metrics", completed: true },
  { id: 102, title: "Fix image rendering", description: "Address issues with image display on high-DPI screens", completed: false },
  { id: 103, title: "Implement content categorization", description: "Add system for organizing content by categories", completed: true },
  { id: 104, title: "Create user feedback system", description: "Implement mechanism for collecting user feedback", completed: false },
  { id: 105, title: "Fix data export", description: "Address issues with exporting large datasets", completed: true },
  { id: 106, title: "Implement content search", description: "Add full-text search for content", completed: false },
  { id: 107, title: "Create system alerts", description: "Implement alerting for critical system events", completed: true },
  { id: 108, title: "Fix user registration", description: "Address issues with new user registration flow", completed: false },
  { id: 109, title: "Implement data import", description: "Add functionality for bulk data import", completed: true },
  { id: 110, title: "Create user dashboard", description: "Build personalized dashboard for users", completed: false },
  { id: 111, title: "Fix comment notifications", description: "Address issues with comment reply notifications", completed: true },
  { id: 112, title: "Implement content filtering", description: "Add filters for content discovery", completed: false },
  { id: 113, title: "Create system documentation", description: "Document system architecture and components", completed: true },
  { id: 114, title: "Fix password complexity", description: "Improve password strength requirements", completed: false },
  { id: 115, title: "Implement content sharing", description: "Add functionality to share content externally", completed: true },
  { id: 116, title: "Create user reports", description: "Implement reporting for problematic users or content", completed: false },
  { id: 117, title: "Fix data visualization", description: "Address issues with chart rendering", completed: true },
  { id: 118, title: "Implement content recommendations", description: "Add algorithm for suggesting relevant content", completed: false },
  { id: 119, title: "Create system monitoring", description: "Implement comprehensive system monitoring", completed: true },
  { id: 120, title: "Fix user search", description: "Address issues with user search functionality", completed: false },
  { id: 121, title: "Implement data anonymization", description: "Add tools for anonymizing sensitive data", completed: true },
  { id: 122, title: "Create user activity feed", description: "Build personalized activity feed for users", completed: false },
  { id: 123, title: "Fix file uploads", description: "Address issues with large file uploads", completed: true },
  { id: 124, title: "Implement content scheduling", description: "Add functionality to schedule content publication", completed: false },
  { id: 125, title: "Create system health checks", description: "Implement automated system health verification", completed: true },
  { id: 126, title: "Fix user permissions", description: "Address issues with permission assignment", completed: false },
  { id: 127, title: "Implement data retention", description: "Add policies for data retention and deletion", completed: true },
  { id: 128, title: "Create user notifications", description: "Build notification system for user activities", completed: false },
  { id: 129, title: "Fix search indexing", description: "Address issues with search index updates", completed: true },
  { id: 130, title: "Implement content moderation", description: "Add tools for moderating user-generated content", completed: false },
  { id: 131, title: "Create system reports", description: "Build reporting functionality for system metrics", completed: true },
  { id: 132, title: "Fix user authentication", description: "Address issues with authentication flow", completed: false },
  { id: 133, title: "Implement data validation", description: "Add comprehensive input validation", completed: true },
  { id: 134, title: "Create user profiles", description: "Build enhanced user profile functionality", completed: false },
  { id: 135, title: "Fix email templates", description: "Address issues with email rendering in clients", completed: true },
  { id: 136, title: "Implement content analytics", description: "Add analytics for content performance", completed: false },
  { id: 137, title: "Create system backups", description: "Implement automated backup procedures", completed: true },
  { id: 138, title: "Fix user sessions", description: "Address issues with session management", completed: false },
  { id: 139, title: "Implement data migration", description: "Add tools for migrating data between systems", completed: true },
  { id: 140, title: "Create user settings", description: "Build user-configurable application settings", completed: false },
  { id: 141, title: "Fix search relevance", description: "Improve relevance of search results", completed: true },
  { id: 142, title: "Implement content caching", description: "Add caching for frequently accessed content", completed: false },
  { id: 143, title: "Create system documentation", description: "Document system architecture and components", completed: true },
  { id: 144, title: "Fix user invitations", description: "Address issues with user invitation process", completed: false },
  { id: 145, title: "Implement data backup", description: "Add automated data backup functionality", completed: true },
  { id: 146, title: "Create user feedback", description: "Build mechanism for collecting user feedback", completed: false },
  { id: 147, title: "Fix file permissions", description: "Address issues with file access permissions", completed: true },
  { id: 148, title: "Implement content delivery", description: "Optimize content delivery to users", completed: false },
  { id: 149, title: "Create system alerts", description: "Implement alerting for critical system events", completed: true },
  { id: 150, title: "Fix user roles", description: "Address issues with role-based permissions", completed: false },
  { id: 151, title: "Implement data archiving", description: "Add functionality to archive old data", completed: true },
  { id: 152, title: "Create user tutorials", description: "Build interactive tutorials for new users", completed: false },
  { id: 153, title: "Fix search filters", description: "Address issues with search filtering options", completed: true },
  { id: 154, title: "Implement content recommendations", description: "Add personalized content recommendations", completed: false },
  { id: 155, title: "Create system monitoring", description: "Implement comprehensive system monitoring", completed: true },
  { id: 156, title: "Fix user preferences", description: "Address issues with saving user preferences", completed: false },
  { id: 157, title: "Implement data synchronization", description: "Add functionality for data syncing between devices", completed: true },
  { id: 158, title: "Create user achievements", description: "Build gamification elements for user engagement", completed: false },
  { id: 159, title: "Fix notification delivery", description: "Address issues with notification delivery", completed: true },
  { id: 160, title: "Implement content filtering", description: "Add filters for content discovery", completed: false },
  { id: 161, title: "Create system health dashboard", description: "Build dashboard for monitoring system health", completed: true },
  { id: 162, title: "Fix user authentication", description: "Address issues with authentication flow", completed: false },
  { id: 163, title: "Implement data validation", description: "Add comprehensive input validation", completed: true },
  { id: 164, title: "Create user onboarding", description: "Design and implement new user onboarding", completed: false },
  { id: 165, title: "Fix email notifications", description: "Address issues with email notification delivery", completed: true },
  { id: 166, title: "Implement content scheduling", description: "Add functionality to schedule content publication", completed: false },
  { id: 167, title: "Create system documentation", description: "Document system architecture and components", completed: true },
  { id: 168, title: "Fix user permissions", description: "Address issues with permission assignment", completed: false },
  { id: 169, title: "Implement data encryption", description: "Add encryption for sensitive data", completed: true },
  { id: 170, title: "Create user feedback system", description: "Build mechanism for collecting user feedback", completed: false },
  { id: 171, title: "Fix search functionality", description: "Address issues with search performance", completed: true },
  { id: 172, title: "Implement content moderation", description: "Add tools for moderating user content", completed: false },
  { id: 173, title: "Create system alerts", description: "Implement alerting for critical system events", completed: true },
  { id: 174, title: "Fix user registration", description: "Address issues with new user registration", completed: false },
  { id: 175, title: "Implement data backup", description: "Add automated data backup functionality", completed: true },
  { id: 176, title: "Create user dashboard", description: "Build personalized dashboard for users", completed: false },
  { id: 177, title: "Fix file uploads", description: "Address issues with file upload functionality", completed: true },
  { id: 178, title: "Implement content analytics", description: "Add analytics for content performance", completed: false },
  { id: 179, title: "Create system health checks", description: "Implement automated system health verification", completed: true },
  { id: 180, title: "Fix user profiles", description: "Address issues with user profile updates", completed: false },
  { id: 181, title: "Implement data migration", description: "Add tools for migrating data between systems", completed: true },
  { id: 182, title: "Create user notifications", description: "Build notification system for user activities", completed: false },
  { id: 183, title: "Fix search indexing", description: "Address issues with search index updates", completed: true },
  { id: 184, title: "Implement content caching", description: "Add caching for frequently accessed content", completed: false },
  { id: 185, title: "Create system reports", description: "Build reporting functionality for system metrics", completed: true },
  { id: 186, title: "Fix user sessions", description: "Address issues with session management", completed: false },
  { id: 187, title: "Implement data archiving", description: "Add functionality to archive old data", completed: true },
  { id: 188, title: "Create user settings", description: "Build user-configurable application settings", completed: false },
  { id: 189, title: "Fix email templates", description: "Address issues with email rendering", completed: true },
  { id: 190, title: "Implement content delivery", description: "Optimize content delivery to users", completed: false },
  { id: 191, title: "Create system backups", description: "Implement automated backup procedures", completed: true },
  { id: 192, title: "Fix user invitations", description: "Address issues with user invitation process", completed: false },
  { id: 193, title: "Implement data validation", description: "Add comprehensive input validation", completed: true },
  { id: 194, title: "Create user tutorials", description: "Build interactive tutorials for new users", completed: false },
  { id: 195, title: "Fix notification preferences", description: "Address issues with notification settings", completed: true },
  { id: 196, title: "Implement content recommendations", description: "Add personalized content recommendations", completed: false },
  { id: 197, title: "Create system monitoring", description: "Implement comprehensive system monitoring", completed: true },
  { id: 198, title: "Fix user authentication", description: "Address issues with authentication flow", completed: false },
  { id: 199, title: "Implement data synchronization", description: "Add functionality for data syncing", completed: true },
  { id: 200, title: "Create user achievements", description: "Build gamification elements for engagement", completed: false },
];

export const getDummyTasks = (filters: TasksFilters): TasksAPIResponse => {
	let filteredTasks = [...DUMMY_TASKS];

	if (filters.title) {
		const titleLower = filters.title.toLowerCase();
		filteredTasks = filteredTasks.filter((task) => task.title.toLowerCase().includes(titleLower));
	}

	if (filters.description) {
		const descLower = filters.description.toLowerCase();
		filteredTasks = filteredTasks.filter((task) => task.description.toLowerCase().includes(descLower));
	}

	filteredTasks = filters.completedOnly ? filteredTasks.filter((task) => task.completed) : filteredTasks;

	return {
		tasks: filteredTasks
	};
};
