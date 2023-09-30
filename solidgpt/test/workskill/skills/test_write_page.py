import os
from solidgpt.definitions import TEST_SKILL_WORKSPACE
from solidgpt.src.manager.initializer import Initializer
from solidgpt.src.workgraph.workgraph import WorkGraph
from solidgpt.src.worknode.worknode import WorkNode
from solidgpt.src.workskill.skills.write_yaml import WriteYAML
from solidgpt.src.workskill.workskill import WorkSkill

md = """
# Frontend Development Kanban Board

| Task Name | Task Description | User Story | Acceptance Criteria | Priority (H/M/L) | Status (Input/Spec/Imple/PR/Done/Pending) | Due Date | Engineer Points |
|-----------|-----------------|------------|---------------------|------------------|-------------------------------------------|----------|----------------|
| Task 1    | Create Homepage | As a user, I want to see a visually appealing and informative homepage so that I can understand the purpose of the AI Says application. | - Design and implement the header section with the app's title/logo and navigation menu. <br> - Design and implement the banner section with a featured image or slider. <br> - Design and implement the feature cards row section with three cards containing icons, titles, and descriptions of key features. <br> - Design and implement the footer section with links and secondary navigation. | M | Input | 2022-01-15 | 5 |
| Task 2    | Create About Page | As a user, I want to learn more about the company or app behind AI Says so that I can trust the information and recommendations provided. | - Design and implement the header section consistent with the homepage. <br> - Design and implement the company overview section with information about the company or app. <br> - Design and implement the team section with team members' photos and bios. <br> - Design and implement the footer section consistent with the homepage. | M | Input | 2022-01-20 | 5 |
| Task 3    | Create Products Page | As a user, I want to view the products/services offered by AI Says so that I can make informed decisions about my investments. | - Design and implement the header section consistent with the homepage. <br> - Design and implement the product list section with cards containing images, titles, descriptions, and prices of products/services. <br> - Design and implement filter and sorting options for the product list. <br> - Design and implement the footer section consistent with the homepage. | M | Input | 2022-01-25 | 8 |
| Task 4    | Create Contact Page | As a user, I want to easily contact the company or app behind AI Says so that I can ask questions or provide feedback. | - Design and implement the header section consistent with the homepage. <br> - Design and implement the contact form section with fields for name, email, subject, and message. <br> - Design and implement the location map section to show the company or app's location. <br> - Design and implement the footer section consistent with the homepage. | M | Input | 2022-01-30 | 5 |
| Task 5    | Implement Responsiveness | As a user, I want to be able to access and use the AI Says application on various devices, including smartphones and tablets. | - Ensure the application layout and components adapt to different screen sizes. <br> - Test the application on different devices and screen resolutions. <br> - Make necessary adjustments to ensure a seamless user experience on all devices. | H | Input | 2022-02-05 | 3 |
| Task 6    | Implement Feedback Mechanisms | As a user, I want to receive feedback after key interactions, such as submitting a form or receiving a recommendation. | - Design and implement success messages for form submissions. <br> - Design and implement error messages for form validation failures. <br> - Design and implement visual indicators to show the progress of a task. | M | Input | 2022-02-10 | 3 |
| Task 7    | Optimize Loading Time | As a user, I want the AI Says application to load quickly and provide a seamless user experience. | - Optimize image sizes and compression to reduce loading time. <br> - Implement lazy loading for assets to improve initial loading time. <br> - Implement caching for frequently accessed data and assets. | H | Input | 2022-02-15 | 5 |
| Task 8    | Implement Accessibility | As a user, I want the AI Says application to be accessible to users with disabilities. | - Provide alternative text for images. <br> - Ensure appropriate color contrast for text and background elements. <br> - Make the application keyboard navigable. | M | Input | 2022-02-20 | 3 |
| Task 9    | Implement Consistent Design | As a user, I want the AI Says application to have a consistent design language across all pages. | - Ensure consistent design elements, colors, and typography. <br> - Create reusable components for consistent design. <br> - Apply design principles to maintain a cohesive and visually appealing user interface. | H | Input | 2022-02-25 | 5 |
| Task 10   | Implement Modularity | As a developer, I want to create reusable components for easy maintenance and scalability of the application. | - Identify opportunities for creating reusable components. <br> - Design and implement modular components. <br> - Test and validate the reusability of components. | H | Input | 2022-03-01 | 8 |
| Task 11   | Implement Interactivity | As a user, I want the AI Says application to have subtle animations and transitions to enhance interactivity and engagement. | - Identify key interactions and areas for animations/transitions. <br> - Design and implement animations/transitions using appropriate techniques. <br> - Test and validate the impact of animations/transitions on user experience. | M | Input | 2022-03-05 | 3 |
| Task 12   | Implement Input Validation | As a developer, I want to validate user inputs on the frontend to prevent security vulnerabilities. | - Identify input fields that require validation. <br> - Implement input validation using appropriate techniques and libraries. <br> - Test and validate the effectiveness of input validation. | H | Input | 2022-03-10 | 5 |
| Task 13   | Implement Secure Data Transmission | As a developer, I want to ensure secure data transmission to protect user data. | - Implement HTTPS for secure data transmission. <br> - Test and validate the encryption of sensitive information during transmission. | H | Input | 2022-03-15 | 3 |
| Task 14   | Implement Secure Cookies and Local Storage | As a developer, I want to ensure secure storage of data in cookies and local storage. | - Encrypt data stored in cookies and local storage. <br> - Minimize the amount of data stored in cookies and local storage. <br> - Test and validate the security of data stored in cookies and local storage. | M | Input | 2022-03-20 | 3 |
| Task 15   | Conduct Cross-Browser Testing | As a developer, I want to ensure the AI Says application works consistently across different browsers. | - Test the application on Chrome, Firefox, Safari, and Edge. <br> - Identify and fix any browser-specific issues. <br> - Validate the consistency of the application across all major browsers. | H | Input | 2022-03-25 | 5 |
| Task 16   | Conduct Mobile Testing | As a developer, I want to ensure the AI Says application is responsive and functions correctly on mobile devices. | - Test the application on different smartphones and tablets. <br> - Identify and fix any layout or functionality issues specific to mobile devices. <br> - Validate the responsiveness and functionality of the application on various screen sizes. | H | Input | 2022-03-30 | 5 |
| Task 17   | Conduct User Testing | As a developer, I want to gather user feedback to improve the AI Says application. | - Plan and conduct user testing sessions. <br> - Collect feedback through surveys, interviews, or usability testing. <br> - Analyze feedback and identify areas of improvement. | H | Input | 2022-04-05 | 8 |
| Task 18   | Conduct Beta Testing | As a developer, I want to gather feedback from a limited audience before the official release. | - Select a group of users for beta testing. <br> - Provide access to the application and gather feedback on functionality, usability, and performance. <br> - Identify and address any issues or bugs identified during beta testing. | H | Input | 2022-04-10 | 8 |
| Task 19   | Implement Versioning System | As a developer, I want to implement a versioning system for easy rollback to stable versions. | - Set up a versioning system for the frontend application. <br> - Define versioning conventions and practices. <br> - Ensure the ability to roll back to stable versions if needed. | M | Input | 2022-04-15 | 3 |
| Task 20   | Implement Feedback Loop | As a developer, I want to collect and address user feedback after the official release. | - Set up channels for collecting user feedback, such as email, support tickets, or a feedback form. <br> - Analyze and categorize user feedback. <br> - Make iterative improvements to the frontend application based on user feedback. | M | Input | 2022-04-20 | 5 |

Note: The "Status" column represents the current status of each task, with the following possible values: Input (requirements gathering), Spec (specification/design), Imple (implementation), PR (pull request for code review), Done (completed and tested), Pending (waiting for dependencies or further action).
"""
# skill = WriteMainPage.WriteYAML()
# skill.kanban_md = md
# skill.execution_impl()

# skill2 = WriteSubPage.WritePageYAML()
# skill2.kanban_md = md
# skill2.execution_impl()

def run_test():
    Initializer()
    app = WorkGraph()
    skill: WorkSkill = WriteYAML()
    input_path = os.path.join(TEST_SKILL_WORKSPACE, "in", "Kanban.md")
    skill.init_config(
        [
            {
                "param_path": input_path,
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_STRING",
                "load_from_output_id": -1
            },
        ],
        [
            {
                "id": 1
            } 
        ])
    node = WorkNode("1", skill)
    app.add_node(node)
    app.init_node_dependencies()
    app.execute()

if __name__ == "__main__":
    run_test()