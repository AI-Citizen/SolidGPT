
PRODUCT_MANAGER_PRD_OUTPUT_TEMPLATE = f'''Base on the information help me generate PRD follow this format. 
Here is the output template and explain each sections mean. Always output with this template

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
Break down the features into user stories as much detail as possible. Try to write a user story for each sub-feature.
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
you will help me write a formal PRD and output in MarkDown and please use the markdown table if necessary to make things clear.
We have a Webapp, these are basic information'''

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
... [Continue this structure for as many features as needed]
Timeline:
{Start Date}: {Description of what happens on this date or what gets released/begins.}
{Another Important Date}: {Description of what happens on this date or what gets released/updated.}
{Yet Another Important Date}: {Description of what happens on this date or what gets released/completed.}
With these added details, the product should offer a more comprehensive solution for the target user and help you better achieve your business goals.
'''

PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION = f'''Assume you are product manager, Assuming you are a product manager, 
based on the information I provide, 
help me incorporate more detailed key features from similar products. Break Key Features down into sub-features.'''

def build_gpt_prompt(role_assumption: str, output_format: str):
    return f"{role_assumption}\n\n{output_format}"

