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

SDE_LOWDEFY_ASSUMPTION = f'''Assume you are a Software developer specializing in lowdefy,
You will create lowdefy yaml files given product requirement document.
You must follow theses principles.
1. Do not generate actions.
2. Do not import plugins that are not already built.
3. Do not generate reference pages (fields with '_ref').
4. Do not create functions or events.
5. Do not generate duplicate map keys in yaml file.
6. Be concise. Keep the yaml file less than 200 lines.
7. Always use lowdefy version 4.0.0-rc.10"
8. Do not use Nested mappings, only one colon is allowed in each line.
'''

SDE_LOWDEFY_YAML_OUTPUT_TEMPLATE = '''
Task: Create a sample main page with the name lowdefy.yaml
Answer:
```yaml
lowdefy: 4.0.0-rc.10
name: Lowdefy starter
menus:
  - id: default
    links:
      - id: new-ticket
        type: MenuLink
        properties:
          icon: AiOutlineAlert
          title: New ticket
        pageId: new-ticket
      - id: welcome
        type: MenuLink
        properties:
          icon: AiOutlineHome
          title: Home
        pageId: welcome
pages:
  - _ref: new-ticket.yaml
  - id: welcome
    type: PageHeaderMenu
    properties:
      title: Welcome
    areas:
      content:
        justify: center
        blocks:
          - id: content_card
            type: Card
            style:
              maxWidth: 800
            blocks:
              - id: content
                type: Result
                properties:
                  title: Welcome to your Lowdefy app
                  subTitle: We are excited to see what you are going to build
                  icon:
                    name: AiOutlineHeart
                    color: '#f00'
                areas:
                  extra:
                    blocks:
                      - id: docs_button
                        type: Button
                        properties:
                          size: large
                          title: Let's build something
                        events:
                          onClick:
                            - id: link_to_docs
                              type: Link
                              params:
                                url: https://docs.lowdefy.com
                                newWindow: true
```
Task: Create a page for a web form where users can log a new ticket with the name new-ticket.yaml
Answer:
```yaml
id: new-ticket
type: PageHeaderMenu
properties:
  title: New ticket # The title in the browser tab.
layout:
  contentJustify: center # Center the contents of the page.
blocks:
  - id: content_card
    type: Card
    layout:
      size: 800 # Set the size of the card so it does not fill the full screen.
      contentGutter: 16 # Make a 16px gap between all blocks in this card.
    blocks:
      - id: page_heading
        type: Title
        properties:
          content: Log a ticket # Change the title on the page.
          level: 3 # Make the title a little smaller (an html `<h3>`).
```
Task: Create a BI report/dashboard pages in Lowdefy with the name lowdefy.yaml
Answer:
```yaml
name: Lowdefy Reporting Example
lowdefy: 4.0.0-rc.10
licence: MIT

# description
# This example show patterns that can be used to implement a BI report/dashboard.
# It assumes that it is connected to a MongoDB database with the Atlas sample dataset loaded.

# Define all the data connections, in this case the brands and products MongoDB collections
connections:
  - id: movies_mongodb # The connectionId that will be used when defining requests and mutations on our pages
    type: MongoDBCollection
    properties:
      databaseName: sample_mflix # The database name
      collection: movies # The collection name
      databaseUri:
        _secret: EXAMPLES_MDB # The database connection uri that is stored as a secret and accessed using the _secret operator

# Menus used in the app can be listed here
# By default, the menu with id default, or the first menu defined is used.
# If no menu is defined, a default menu is created using all the defined pages.
menus:
  - id: default
    links:
      - id: report # Define the menu link that directs to the report page
        type: MenuLink
        pageId: report # Id of the report page
        properties:
          title: Report # Title to show on the menu
          icon: AiOutlineLineChart

# All the pages in the app are listed here
# Instead of defining the page in the lowdefy.yaml file, it is defined in its own yaml file and referenced here
pages:
  - _ref: report.yaml
```
Task: Create the main page of blog web app with the name lowdefy.yaml
Answer: 
```yaml
lowdefy: 3.23.3
name: Lowdefy starter
licence: MIT

config:
  # Always direct users to home.
  homePageId: home
  auth:
    openId:
      # The url the user should be redirected to after logout.
      logoutRedirectUri: '{{ openid_domain }}/v2/logout?returnTo={{ host }}/home&client_id={{ client_id }}'
    pages:
      # All pages in the app can be seen only by logged in users
      protected: true
      # except for the following pages:
      public:
        - login
        - '404'
        - home

types:
  AmChartsPie:
    url: https://blocks-cdn.lowdefy.com/v3.10.1/blocks-amcharts/meta/AmChartsPie.json

connections:
  - id: blog_posts
    type: MongoDBCollection
    properties:
      databaseUri:
        _secret: MONGODB_URI
      databaseName: lowdefy_blog
      collection: blog_posts
      write: true

menus:
  - id: default
    links:
      - id: home
        type: MenuLink
        properties:
          icon: HomeOutlined
          title: Home
        pageId: home
      - id: analytics
        type: MenuLink
        properties:
          icon: LineChartOutlined
          title: Analytics
        pageId: analytics
      - id: new-blog-post
        type: MenuLink
        properties:
          icon: FormOutlined
          title: New Blog Post
        pageId: new-blog-post

pages:
  - _ref: home.yaml
  - _ref: analytics.yaml
  - _ref: new-blog-post.yaml
  - _ref: edit-blog-post.yaml
  - _ref: login.yaml
```
'''

### CUSTOM SKILL GENERATOR
CUSTOM_GENERATE_PRINCIPLES = f'''Base on the inforamtion I provide, help me generate principles follow this format.
Principle : [Principle  description]'''

CUSTOM_GENERATE_LIST_SKILLS_OUTPUT_FORMAT = '''
skill1:description &&skill2:description &&skill3:description &&skill4:description &&skill5:description&&
'''

CUSTOM_GENERATE_SKILL_JSON_ROLE_ASSUMPTION = f'''Base on the inforamtion I provide, help me generate individual json file for the skill. Only output json file'''

CUSTOM_GENERATE_SKILL_JSON_OUTPUT_FORMAT = '''{
    "skill_name": "skill name",
    "basic_description": "give a short description for this skill",
    "instruction": "How to do what's the tenant, and what's the step by step instructions",
    "qa_example": "give one or two, input output example",
    "background_data_path": "", (Don't need to change this)
    "input_method": "SkillIOParamCategory.PlainText", (Don't need to change this)
    "output_method": "SkillIOParamCategory.PlainText" (Don't need to change this)
}'''

def get_custom_skills_assumption_role_prompt(question_subject):
    return f"""Assume you are the expert of {question_subject}. 
I want to know the list of top 5 essential actual hard skills (no softskill) for the {question_subject}. Can you please list them for me and use && sign to seperate them?"""

def build_gpt_prompt(role_assumption: str, output_format: str):
    return f"{role_assumption}\n\nAlways follow the Output format which is: {output_format}"

def build_gpt_standard_prompt(role_assumption: str, description: str, output_format: str):
    return f"{role_assumption}\n\nThis task description: {description}\n\n Output format: {output_format}"

def build_custom_skill_gpt_prompt(role_assumption: str, instruction: str, principles: str, few_shots: str):
    return f'''{role_assumption}\n\n 
    Here are instruction, always get the answer from instruction first 
    and if no suitable content then response base on your professional knowledge. instruction: {instruction}\n\n
    Here are principles you need to always follow: {principles}\n\n 
    Here are the prompt and completion examples: {few_shots}'''
