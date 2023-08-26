PRODUCT_MANAGER_PRD_OUTPUT_TEMPLATE = f'''Base on the information help me generate Markdown PRD follow this format. 
Here is the output template and explain each sections mean. Always output with this template in Markdown format.

Overview
[what is the problem you are trying to solve?]

Target Customers
[Who is the primary person you are solving a problem for? If there are multiple groups of people, 
which ones ar you prioritizing first? 
Products optimized for power users will be different thant if they were designed for new users]

Business Ojective Opportunity
[What is the business reason for why we should solve this problem? What is the business strategy 
here? Are we falling behind our competitors? Are we entireing a new market? What's the opportunity size?]
[How will you measure the success of this product? How will you know you are ready to ramp/launch this product]
[What about downside metrics?(e.g. customer complain)]

Scope/Out-of-Scope
[What will your product NOT do? How will you know when this product is "done"]

User Stories
[Based on each of the provided sub-features and key features, 
Break down the features into user stories as much as possible. Try to write a user story for each sub-feature.
Add more user stories based on similar products or your professional insight.]
| Story                                                                                       | Value(L,M,H) | Cost/Complexity(L,M,H) | Priority |
|---------------------------------------------------------------------------------------------|--------------|------------------------|----------|
| As a [user type], I want to [action], so that [benefit/outcome].                             | M            | H                      | 1        |
| As a [user type], I need [some feature], in order to [achieve some goal].                   | L            | M                      | 2        |
| As a [user type], I wish [some desire], ensuring [some reason].                             | H            | L                      | 3        |


		
Additional Requirements and Feature Details
[What key features are absolutely required? What should a user NOT be able to do? 
What coner case we should whatch out for?
Which features might we want to build in the future but which are not planned for initial release]
[What's the feature details? What are the sub-features? What are the acceptance criteria?]
Features Release Table
| Features                           | Description   | Accept Criteria | Priority |
|------------------------------------|---------------|-----------------|----------|
| Feature Name (e.g. Login System)   | Short description of the feature. | Criteria for acceptance (e.g. User can log in with valid credentials). | High/Medium/Low |
		
Launch Milestones & Phases
[Break down the product into manageable chunks in terms of features]
[What are key milestones in research/discovery, design, development, pilot, and launch?]
[What are the criteria for pilot and launch? Acceptance criteria(typically eng/pm-defined)and acceptance testing(business user)?]
We will often build a vision for phases of launch, along with stories/features a addressed in each stage.
| Timing             | Features/User Stories         | Key Objectives                            |
|--------------------|-------------------------------|-------------------------------------------|
| Quarter/Month/Date | [Feature x, y,z]              | example: Successful pilot with 20 customer|
'''

PRODUCT_MANAGER_PRD_ROLE_ASSUMPTION = f'''Assume you are product manager, 
you will help me write a formal PRD and output in Markdown and please use the markdown table if necessary to make things clear.
Add more user stories based on similar products or your professional insight. These are the basic information'''

PRODUCT_MANAGER_BRAINSTORM_OUTPUT_TEMPLATE = ''' 
Given the provided information, let's expand on the key features for product to create a more comprehensive product offering.
Base on the information help me generate brainstorm follow this format.
Product Name: {Product Name}
One Sentence Description: {One Sentence Description}
Target User: {Target User}
Business Goal: {Business Goal}
Key Features:
{Feature 1}
{Feature 2}
{Feature 3}
{Feature 4}
[Continue this structure for as many features as needed]
{Feature n}
Timeline:
{Start Date}: {Description of what happens on this date or what gets released/begins.}
{Another Important Date}: {Description of what happens on this date or what gets released/updated.}
{Yet Another Important Date}: {Description of what happens on this date or what gets released/completed.}
With these added details, the product should offer a more comprehensive solution for the target user and help you better achieve your business goals.
'''

PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION = f'''Assume you are product manager, Assuming you are a product manager, 
based on the information I provide, do following things:
1. Breakdown each key feature into more detailed key features.
2. Get more key features from similar products or your professional insight.'''

PE_FRONTEND_ROLE_ASSUPTION = f'''Assuming you are a Principal Frontend Software Engineer, 
help me write a Frontend Dev Design Document using the PRD Doc provided. 
Ensure you adhere to the Frontend Design Principles listed below and use it as a guide.
'''

PE_FRONTEND_DESIGN_OUTPUT_TEMPLATE = '''Frontend Design Principles:
1. User Experience (UX):
Responsiveness: Ensure mobile-responsive design.
Navigation: Intuitive navigation.
Feedback: Feedback after key interactions.
Loading Time: Fast loading times.
Accessibility: Adherence to accessibility standards.
2. User Interface (UI) Always elaberate more details as much as you can for each page in this section. Please include the layout, component, color theme, part of important text, font size, api request, page transition logic, business logic
Pages & Routing:
Homepage: Primary landing page.
About Page: Company or app info.
Products Page: Lists products/services.
Contact Page: Contact info & form.
Homepage Layout:Header: App's title/logo and navigation.
Banner: Featured image or slider.
Feature Cards Row: Three cards with icon, title, and description.
Footer: Links and secondary navigation.
About Page Layout:Header: Consistent with Homepage.
Company Overview: Text about company.
Team Section: Team members' photos and bios.
Footer: Consistent with Homepage.
Products Page Layout:Header: Consistent with Homepage.
Product List: Cards with image, title, description, and price.
Filter & Sorting Options: Filter by categories or sort.
Footer: Consistent with Homepage.
Contact Page Layout:Header: Consistent with Homepage.
Contact Form: Fields like Name, Email, Subject, and Message.
Location Map: Embedded map.
Footer: Consistent with Homepage.
Common Components:Navigation Menu: In Header.
Call to Action Buttons: Styled buttons for key actions.
3. Design Considerations:
Consistency: Uniform design language.
Modularity: Reusable components.
Interactivity: Subtle animations/transitions.
4. Performance:
Optimize Images: Compressed and sized images.
Lazy Loading: Load assets on demand.
Caching: Cache frequently accessed data/assets.
5. Security:
Input Validation: Validate user inputs.
Data Transmission: Secure data transmission methods.
Cookies and Local Storage: Encrypted or minimal data storage.
6. Testing:
Cross-Browser Testing: Uniformity across browsers.
Mobile Testing: Testing on different mobile devices.
User Testing: Real user feedback.
7. Rollout Strategy:
Beta Testing: Limited audience release.
Versioning: Easily roll back to stable versions.
Feedback Loop: System for user feedback.
'''

PE_ROE_ASSUMPTION = f'''Assuming you are a Software Development Manager, 
help me create a Kanban board baseon the Dev Desgin.
'''

PE_KANBAN_OUTPUT_TEMPLATE = f'''Based on the provided high level design, 
could you help me create a development Kanban board using Markdown format? 
The columns I'd like are: 
|Task Name|Task Description|User story|Acceptance Criteria|Priority (H/M/L)|Status (Input/Spec/Imple/PR/Done/Pending)|Due Date|Engineer Points|.'''


CUSTOM_GENERATE_PRINCIPLES = f'''Base on the inforamtion I provide, help me generate principles follow this format.
Principle : [Principle  description]'''

def build_gpt_prompt(role_assumption: str, output_format: str):
    return f"{role_assumption}\n\nOutput format is: {output_format}"

def build_gpt_standard_prompt(role_assumption: str, description: str, output_format: str):
    return f"{role_assumption}\n\nThis task description: {description}\n\n Output format: {output_format}"

def build_custom_skill_gpt_prompt(role_assumption: str, instruction: str, principles: str, few_shots: str):
    return f'''{role_assumption}\n\n 
    Here are instruction, always get the answer from instruction first 
    and if no suitable content then response base on your professional knowledge. instruction: {instruction}\n\n
    Here are principles you need to always follow: {principles}\n\n 
    Here are the prompt and completion examples: {few_shots}'''
