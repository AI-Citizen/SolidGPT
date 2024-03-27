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

PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION = f'''Assuming you are a product manager, 
based on the information I provide, do following things:
1. Point out each key features and details.
2. Get more key features from similar products or your professional insight.'''

PRODUCT_MANAGER_ANALYSIS_ROLE_ASSUMPTION = f'''Assume you are Principal Product Manager, 
I will provide you our product instruction, product background additional information and requirements. 
Help me use 5W2H to analysis and expend the requirments base on the project instrucution and product background additional information.'''

PRODUCT_MANAGER_5H2W_OUTPUT_TEMPLATE = '''## 1. What:
- **Description**: 
  - What is the main problem or goal?
  - What are the features or functionalities involved?
## 2. Why:
- **Rationale & Benefits**:
  - Why is this necessary?
  - Why are we doing this now?
  - What benefits will it bring?
## 3. Where:
- **Location & Placement**:
  - Where will this be implemented or take place?
  - Where will the end results be visible?
## 4. Who:
- **Stakeholders & Responsibilities**:
  - Who is responsible for this?
  - Who are the end-users or beneficiaries?
  - Who will be affected by this?
## 5. When:
- **Timeline & Deadlines**:
  - When will this start?
  - When is the expected completion or launch date?
  - Are there any key milestones?
## 6. How:
- **Process & Method**:
  - How will this be accomplished or implemented?
  - What tools, techniques, or methods will be used?
## 7. How Much:
- **Cost & Resources**:
  - How much will this cost?
  - How much time will it require?
  - What resources are needed?'''

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
You will create lowdefy yaml files given kanban tasks.
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

SDE_LOWDEFY_PAGE_ASSUMPTION = f'''Assume you are a Software developer specializing in lowdefy,
You will create yaml files given kanban board tasks.
You must follow theses principles.
1. Do not generate actions.
2. Do not import plugins that are not already built.
3. Do not generate reference pages (fields with '_ref').
4. Do not create functions or events.
5. Do not generate duplicate map keys in yaml file.
6. Be concise. Keep the yaml file less than 200 lines.
7. Do not use Nested mappings, only one colon is allowed in each line.
'''

SDE_PAGE_YAML_OUTPUT_TEMPLATE = f'''
Task: Create a page referred in the main page that can generate business report.
Answer:
```yaml
id: report
type: PageHeaderMenu
properties:
  title: Report
layout:
  contentGutter: 16 # Set a gutter of 16px between all the cards on the page
requests:
  # Request for the bar and pie charts
  - id: scores_by_genre
    type: MongoDBAggregation # MongoDB Aggregation to get the data
    connectionId: movies_mongodb
    properties:
      pipeline:
        - $unwind:
            path: $genres # Genres is an array, so unwind to create 1 document for every array entry
        - $match: # Only look at top 6 genres
            genres:
              $in:
                - Drama
                - Comedy
                - Romance
                - Crime
                - Thriller
                - Action
        - $group:
            # Calculate the average Rotten Tomatoes viewer and critic ratings for each genre.
            _id: $genres # Group data by the genre field
            viewerRating:
              $avg: $tomatoes.viewer.rating
            criticRating:
              $avg: $tomatoes.critic.rating
            count:
              $sum: 1 # Count the number of documents by summing 1 for every document
        - $addFields:
            # Multiply viewerRating by 2 as it is out of 5 not 10.
            viewerRating:
              $multiply:
                - $viewerRating
                - 2
        - $sort:
            count: -1 # Sort by descending count

  # Request for the table
  - id: top_100_score_difference_movies
    type: MongoDBAggregation # MongoDB Aggregation to get the data
    connectionId: movies_mongodb
    properties:
      pipeline:
        - $match:
            tomatoes.critic.numReviews: # Match where there are 20 or more critic reviews
              $gte: 20
            tomatoes.viewer.numReviews: # and 100 or more viewer reviews
              $gte: 100
            genres: # Only look at top 6 genres
              $in:
                - Drama
                - Comedy
                - Romance
                - Crime
                - Thriller
                - Action
        - $project: # Include fields we want to show in the table
            title: 1
            year: 1
            rated: 1
            viewerRating: # Multiply viewerRating by 2 as it is out of 5 not 10.
              $multiply:
                - $tomatoes.viewer.rating
                - 2
            criticRating: $tomatoes.critic.rating
            viewerReviews: $tomatoes.viewer.numReviews
            criticReviews: $tomatoes.critic.numReviews
            difference: # Calculate the difference between the critic and viewer scores
              $abs: # Take the absolute (positive) value
                $subtract:
                  - $multiply:
                      - $tomatoes.viewer.rating
                      - 2
                  - $tomatoes.critic.rating
        - $sort:
            difference: -1 # Sort by biggest difference
        - $limit: 100 # Only return the first 100 results

events:
  # A list of actions that gets completed when this page is first loaded.
  onInitAsync:
    - id: fetch_data # Fetch the request data before the page renders in order to populate the charts
      type: Request
      params:
        - scores_by_genre
        - top_100_score_difference_movies

areas:
  content:
    blocks:
      - id: title # Title on page
        type: Title
        properties:
          content: Movie Critic and Viewer Ratings
          level: 4
      - id: genre_counts_bar_chart_card
        type: Card
        properties:
          title: Comparison of Critic and Viewer Ratings by Genre
        layout:
          span: 16 # Make the card span 2 thirds of the screen
        blocks:
          - id: genre_counts_bar_chart
            type: EChart
            properties:
              height: 400
              option:
                dataset:
                  source:
                    _request: scores_by_genre # Use scores_by_genre request for chart data
                legend:
                  show: true
                  bottom: 0 # Display legend below chart
                grid:
                  bottom: 100
                tooltip:
                  show: true
                  trigger: item
                xAxis:
                  type: category # Add a category for the x axis
                  data:
                    _array.map: # Map over the data and get the list of _ids which will serve as our categories
                      - _request: scores_by_genre
                      - _function:
                          __args: 0._id
                  axisLabel:
                    rotate: 60 # Rotate the labels
                yAxis:
                  - type: value # Add a value for the y axis
                    name: Rating # Give the y axis a title
                    nameRotate: 90 ß
                    nameLocation: middle
                    nameGap: 40
                    min: # Set minimum y value
                      _function:
                        __math.floor:
                          __if_none:
                            - __args: 0.min
                            - 0
                series:
                  - type: bar # Create a column series to show columns
                    name: Critics Rating
                    itemStyle:
                      color: '#5D7092' # Set column fill color
                      borderColor: '#5D7092' # Set column border color
                    encode:
                      x: _id # Set the category value to the field _id in the data
                      y: criticRating # Set the value value to the field in the data
                  - type: bar
                    name: Viewer Rating
                    itemStyle:
                      color: '#5AD8A6'
                      borderColor: '#5AD8A6'
                    encode:
                      x: _id
                      y: viewerRating

      - id: pie_chart_card
        type: Card
        layout:
          span: 8
        properties:
          title: Genre Counts
        blocks:
          - id: pie_chart
            type: EChart
            properties:
              height: 400
              option:
                series:
                  - name: genre_counts
                    type: pie
                    radius: [30%, 50%] # Make the chart a donut chart
                    label:
                      fontSize: 12
                    data:
                      _mql.aggregate: # Format data to have fields name and value
                        on:
                          _request: scores_by_genre # Share the same request as the bar chart
                        pipeline:
                          - $project:
                              name: $_id
                              value: $count
                          - $sort:
                              value: -1
                    color: # Add custom colors
                      - '#122C6A'
                      - '#0044A4'
                      - '#005BBF'
                      - '#3874DB'
                      - '#5A8DF8'
                      - '#7EABFF'

      - id: table_card
        type: Card
        properties:
          title: 100 Movies with Largest Difference between Critic and Viewer Ratings
        blocks:
          - id: table
            type: AgGridAlpine
            properties:
              theme: basic
              rowData:
                _request: top_100_score_difference_movies
              defaultColDef: # Define default column definitions that apply to all the defined columns
                sortable: true # Enables sorting on the columns when the header is clicked
                resizable: true # Enables resizing of column widths
                filter: true # Enables filtering of the columns using agGrid's default filter
              columnDefs: # Define all the columns
                - headerName: Title # Display name
                  field: title # The field name in the data
                  minWidth: 350
                  flex: 1 0 auto
                - headerName: Year
                  field: year
                  width: 100
                - headerName: Difference
                  field: difference
                  width: 160
                  type: numericColumn # Setting this aligns the number on the right
                  valueFormatter:
                    _function: # Provide a fprmatter function to pretty render the data value.
                      __intl.numberFormat:
                        on:
                          __args: 0.value
                        params:
                          options:
                            minimumFractionDigits: 1 # Format the number with 1 decimal place
                - headerName: Viewer Rating
                  field: viewerRating
                  width: 160
                  type: numericColumn
                  valueFormatter:
                    _function:
                      __intl.numberFormat:
                        on:
                          __args: 0.value
                        params:
                          options:
                            maximumFractionDigits: 1
                - headerName: Critic Rating
                  field: criticRating
                  width: 160
                  type: numericColumn
                  valueFormatter:
                    _function:
                      __intl.numberFormat:
                        on:
                          __args: 0.value
                        params:
                          options:
                            maximumFractionDigits: 1
                - headerName: Viewer Reviews
                  field: viewerReviews
                  width: 160
                  type: numericColumn
                  valueFormatter:
                    _function:
                      __intl.numberFormat:
                        on:
                          __args: 0.value
                        params:
                          options:
                            maximumFractionDigits: 0
                - headerName: Critic Reviews
                  field: criticReviews
                  width: 160
                  type: numericColumn
                  valueFormatter:
                    _function:
                      __intl.numberFormat:
                        on:
                          __args: 0.value
                        params:
                          options:
                            maximumFractionDigits: 0
  header:
    blocks:
      - id: affix
        type: Affix
        blocks:
          - id: source_button
            type: Button
            properties:
              icon: AiOutlineGithub
              title: View App Source Code
              type: default
              shape: round
            events:
              onClick:
                - id: link_repo
                  type: Link
                  params:
                    url: https://github.com/lowdefy/lowdefy-example-reporting
                    newTab: true
```
Task: Create a page referred in the main page that can let users fill in a survey.
Answer:
```yaml
# Define the survey page
id: survey
type: Box
style:
  background: '#ababab'
layout:
  contentAlign: center
requests:
  - id: get_employees
    type: GoogleSheetGetMany
    connectionId: employee_sheet
    properties:
      # Filter all employees which has the role of "Sales person" in the data
      filter:
        role: Sales person
events:
  onInitAsync:
    # When the page initializes, the get_employee request is executed to fetch all "Sales person" employees.
    - id: go_get_employees
      type: Request
      params: get_employees # Here we refer to the get_employees id.
blocks:
  # Add some very basic HTML to create a nice customer friendly company banner.
  - id: logo
    type: Html
    style:
      borderBottom: '0.3em solid #000'
    properties:
      html: '<div style="background: #fff; text-align: center; padding: 10px"><img src="https://lowdefy-public.s3-eu-west-1.amazonaws.com/dunder_logo.jpg" height="80px"/></div>'
  # Wrap our survey questioner to center it nicely for all screen sizes.
  - id: content_box
    type: Box
    style:
      maxWidth: 660
      padding: 30px 30px 60px 30px
      minHeight: 90vh
      background: '#fff'
    layout:
      contentGutter: 20
    blocks:
      - id: title
        type: Title
        style:
          textAlign: center
          paddingTop: 20
        properties:
          content: How was your paper experience?
          level: 1
      - id: intro
        type: Title
        style:
          textAlign: center
          paddingTop: 20
        properties:
          content: Your input is highly valued here at Dunder Mifflin. Your feedback will mostly be used to improve our service to you.
          level: 4
      # The first input field will manage the name field in the page context state variable.
      - id: name
        type: TextInput
        required: true # We indicate that some fields are required, later we will validate our input before submitting the data to the server.
        properties:
          title: Name & Surname
          size: large
      - id: company
        type: TextInput
        required: true
        properties:
          title: Company Name
          size: large
      - id: type
        type: ButtonSelector
        required: true
        properties:
          title: Type
          size: large
          options:
            - Feedback
            - Query
            - Complaint
      # The visible field is used to determine when a block should exist. As a block goes invisible, its field is also remove from the context state.
      - id: sales_person
        type: Selector
        required: true
        visible:
          # These operators evaluate to `true` when the type field is selected and is not equal to the "Feedback" option.
          _and:
            - _not:
                _eq:
                  - _state: type
                  - Feedback
            - _state: type
        properties:
          title: Sales Person
          size: large
          options:
            # The list of selector options are populated from the result of our get_employees request. Here we make use of the mql aggregate operator to modify our request response and sort according to label. The mql.aggregate operator is a client side implementation to run aggregations on client side data using an implementation of MongoDB's Aggregation language.
            _mql.aggregate:
              on:
                _if_none: # Since we are fetching the `get_employees` with onInitAsync, `_request: get_employees` will be `null` until a request response is received. Checking for _if_none here handles the non-array type `on` input error until the data is returned be the request.
                  - _request: get_employees
                  - []
              pipeline:
                - $project:
                    value: $name
                    label: $name
                - $sort:
                    label: 1
      - id: response
        type: TextArea
        required: true
        visible: # The `response` field will only be visible in our webform if the `type` field has a value.
          _if_none:
            - _state: type
            - false
        properties:
          title: Please tell us more
          size: large
      - id: satisfaction_title
        type: Title
        visible:
          _if_none:
            - _state: response
            - false
        style:
          textAlign: center
          paddingTop: 20
        properties:
          content: One last thing, based on your experience with us, how likely are you to recommend Dunder Mufflin Paper Company?
          level: 4
      - id: satisfaction
        type: RatingSlider
        visible:
          _if_none:
            - _state: response
            - false
        properties:
          label:
            disabled: true
      - id: detractor_response_title
        type: Title
        visible:
          # Show a different question based on the customer satisfaction rating.
          _and:
            - _lte:
                - _state: satisfaction
                - 7
            - _if_none:
                - _state: satisfaction
                - false
        style:
          textAlign: center
          paddingTop: 20
        properties:
          content:
            # Some unfair logic to bias Dwight's scores, and also because Jim is probably up to no good.
            _if:
              test:
                _eq:
                  - _state: sales_person
                  - Dwight Schrute
              then: Wait! Be careful what you write... (Did Jim put you up to this?)
              else: Oh no! We can do better!
          level: 4
      - id: detractor_response
        type: TextArea
        required: true
        visible:
          _and:
            - _lte:
                - _state: satisfaction
                - 7
            - _if_none:
                - _state: satisfaction
                - false
        properties:
          title: Please could your provide us with some further detail on your hesitancy to recommend us so we know what to work on.
          placeholder: What could we have done better?
          size: large
          label:
            colon: false
      - id: promoter_response_title
        type: Title
        visible:
          _gt:
            - _state: satisfaction
            - 7
        style:
          textAlign: center
          paddingTop: 20
        properties:
          content: Your smile makes us smile!
          level: 4
      - id: promoter_response
        type: TextArea
        required: true
        visible:
          _gt:
            - _state: satisfaction
            - 7
        properties:
          title: Good news should be shared! Please can you let us know what made you smile so we can keep up the good work.
          placeholder: What did you like?
          size: large
          label:
            colon: false
      - id: save
        type: Button
        visible:
          _if_none:
            - _state: satisfaction
            - false
        requests:
          - id: save_survey
            type: GoogleSheetAppendOne
            connectionId: survey_sheet
            payload:
              row:
                _state: true
            properties:
              row:
                _payload: row
        events:
          # When the save button is clicked:
          onClick:
            - id: set_state # Add a timestamp variable to the context state.
              type: SetState
              params:
                timestamp:
                  _date: now
            - id: validate # Then validate our webform input.
              type: Validate
            - id: call_save # Then call the `save_survey` request which will insert the new response record on the survey Google sheet.
              type: Request
              params: save_survey
            - id: to_thank_you_page # Lastly redirect the customer to the `think-you` page.
              type: Link
              params:
                pageId: thank-you
        properties:
          title: Submit
          block: true
          color: '#000'
          icon: AiOutlineCheck
          size: large
      - id: header_bar
        type: Html
        visible:
          _if_none:
            - _state: satisfaction
            - false
        style:
          fontSize: 10
          textAlign: center
          color: red
        properties:
          html: For this example, the submitted data will be public.
  # Add a static footer to the bottom of the page to link to this repository.
  - id: affix
    type: Affix
    properties:
      offsetBottom: 0
    blocks:
      - id: bar_footer
        type: Box
        layout:
          contentJustify: center
        style:
          background: '#fff'
          padding: 5
          borderTop: '0.3em solid #000'
        blocks:
          - id: link_repo
            type: Anchor
            layout:
              shrink: 1
            properties:
              url: https://github.com/lowdefy/lowdefy-example-survey
              title: ⚡️ View the Lowdefy config for this app ⚡️
              newTab: true
```
Task: Create a page referred in the main page that can post new blog.
Answer:
```yaml
id: new-blog-post
type: PageHeaderMenu
properties:
  title: New Blog Post # The title in the browser tab.
layout:
  contentJustify: center # Center the contents of the page.

requests:
  - id: insert_new_blog_post
    type: MongoDBInsertOne
    connectionId: blog_posts
    properties:
      doc:
        blog_post_title:
          _state: blog_post_title
        blog_post_flair:
          _state: blog_post_flair
        blog_post_description:
          _state: blog_post_description
        blog_post_likes: 0
        created_at:
          _date: now
        updated_at:
          _date: now

areas:
  content:
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
              content: New blog post # Change the title on the page.
              level: 3 # Make the title a little smaller (an html `<h3>`).
          - id: blog_post_title
            type: TextInput
            required: true
            properties:
              title: Title
          - id: blog_post_flair
            type: ButtonSelector
            required: true
            properties:
              title: Flair
              options: # Set the allowed options
                - Informative
                - Update
                - Fact
                - Funny
                - Patch
                - Feedback
          - id: blog_post_description
            type: TextArea
            required: true
            properties:
              title: Description
          - id: clear_button
            type: Button
            layout:
              span: 12 # Set the size of the button (span 12 of 24 columns)
            properties:
              title: Clear
              block: true # Make the button fill all the space available to it
              type: default # Make the button a plain button
              icon: ClearOutlined
            events:
              onClick:
                - id: reset
                  type: Reset
          - id: submit_button
            type: Button
            layout:
              span: 12
            properties:
              title: Submit
              block: true
              type: primary # Make the button a primary button
              icon: SaveOutlined
            events:
              onClick:
                - id: validate
                  type: Validate
                - id: insert_new_blog_post # Make a request to the database
                  type: Request
                  params: insert_new_blog_post
                - id: reset # Reset the form once data has been submitted
                  type: Reset
                - id: link_to_blog_posts # Link back to the blog_posts page.
                  type: Link
                  params:
                    pageId: home

  footer:
    blocks:
      - id: footer
        type: Paragraph
        properties:
          type: secondary
          content: |
            Made using Lowdefy
        style:
          text-align: center
      - id: block_id
        type: Icon
        properties:
          name: RobotOutlined
        style:
          text-align: center
```
'''

SDE_KANBAN_ITEM_TO_LOWDEFY_DESCRIPTION_ASSUMPTION="""Imagine you're a proficient Lowdefy expert and experienced frontend engineer. 
Summarize the four most significant pages derived from the Kanban board items. Subsequently, 
furnish a detailed description of your approach to implementing these pages using Lowdefy, 
keeping in mind that a maximum of four pages can be generated. User Interface (UI) Always elaberate more details as much as you can for each page in this section. Please include the layout, component, color theme, part of important text, font size, api request, page transition logic, business logic
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
Call to Action Buttons: Styled buttons for key actions."""

SDE_AI_TASKS_OUTPUT_TEMPLATE = """
Base on the kanban information help me generate task description follow this format.
***New Page***
{PAGE NAME}:
   - Layout: {Page layout details}
   - Components: {Page component details}
   - Color Theme: {Color Theme details}
   - Important Text: {Specific Text appears on the page}
   - Font Size: {Font size details}
   - API Request: {API Request details}.
   - Page Transition Logic: {Page Transition Logic details}.
   - Business Logic: {Business Logic Details}.
"""

SDE_FRONTEND_HOMEPAGE_ASSUMPTION = f"""
Find and output a single page description of main page/homepage. 
Output the exact page description word by word without any omission.
Do not output the pages that are not related.
"""

SDE_SUMMARIZE_TASK_ASSUMPTION = f"""
Find one word in the page name that best describes the page. Only output a single word.
example: homepage, about, product, contact
"""

SDE_SUMMARIZE_CODE_ASSUMPTION = f"""
Summarize the functionality of the code in three words. Only output the summarized result.
"""


### SDE Tech Solution
SDE_TECH_SOLUTION_ASSUMPTION = f"""Assume you are a principal engineer, and you are going to provide a tech solution for the requirement of project. I will
give you the project information, current code schema, related code, and customer requirements. Always base on the information I provide, 
design a tech solution for the project. You can use Mermaid diagram to show the workflow. And give the step by step instructions, actual code for the solution.
"""

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
    "model_name": "gpt-4", (Don't need to change this)
    "input_method": "SkillIOParamCategory.PlainText", (Don't need to change this)
    "output_method": "SkillIOParamCategory.PlainText" (Don't need to change this)
}'''

SUMMARY_CODE_SUMMARY_README = '''Summary the readme file of the repo into 100 words. The readme file is as below:'''
SUMMARY_PROJECT = '''Assume you are Senior Software engineer, help me summarize the project given the summary of all code files based on the following criteria:
Always use Class, Function, Variable naming, code logic, code path, hierarchy and your professional knowledge to summarize the project.
Word Limit: Ensure the summary is less than 100 words in total. Be consise.
Professional Analysis Summary:
Project's Purpose: Describe the primary objective or role of the project.
Problem Addressed: Explain the specific problem or issue that the code solves.
Output format
1. Project's Purpose:[Your description here]

2. Problem Addressed:[Your description here]
'''
SUMMARY_CODE_SUMMARY_PYTHON = '''Summary the functions of python file into 100 words. Be concise. The python file is as below:'''
SUMMARY_CODE_SUMMARY_SCHEMA = '''Format the schema of the repo. The schema is as below:'''

DEFAULT_SYSTEM_MESSAGE = """You are a helpful AI assistant.
Solve tasks using your coding and language skills.
In the following cases, suggest python code (in a python coding block) or shell script (in a sh coding block) for the user to execute.
    1. When you need to collect info, use the code to output the info you need, for example, browse or search the web, download/read a file, print the content of a webpage or a file, get the current date/time, check the operating system. After sufficient info is printed and the task is ready to be solved based on your language skill, you can solve the task by yourself.
    2. When you need to perform some task with code, use the code to perform the task and output the result. Finish the task smartly.
Solve the task step by step if you need to. If a plan is not provided, explain your plan first. Be clear which step uses code, and which step uses your language skill.
When using code, you must indicate the script type in the code block. The user cannot provide any other feedback or perform any other action beyond executing the code you suggest. The user can't modify your code. So do not suggest incomplete code which requires users to modify. Don't use a code block if it's not intended to be executed by the user.
If you want the user to save the code in a file before executing it, put # filename: <filename> inside the code block as the first line. Don't include multiple code blocks in one response. Do not ask users to copy and paste the result. Instead, use 'print' function for the output when relevant. Check the execution result returned by the user.
If the result indicates there is an error, fix the error and output the code again. Suggest the full code instead of partial code or code changes. If the error can't be fixed or if the task is not solved even after the code is executed successfully, analyze the problem, revisit your assumption, collect additional info you need, and think of a different approach to try.
When you find an answer, verify the answer carefully. Include verifiable evidence in your response if possible.
Reply "TERMINATE" in the end when everything is done.
"""

ASSISTANT_SYSTEM_MESSAGE = """Assume you are principle SDE, you will be an code expert to 
            give code plan, 
            code advise, 
            explain the code.
            Please base on the Project Instruction, Code Schema,
            Relatived code files, and Background I provide below and your professional relatived knowledge
            to response to the Requirements. The requirements as follow:"""
PYTHON_EXPERT_ASSUMPTION = "Assume you are an Senior Software Engineer, I will give you template the code and user requirement instructions. You need to generate the code that satisfy the instructions based on template codes. You should only output the code block. "
PYTHON_DEPENDENCY_EXPERT_ASSUMPTION = "Assume you are an Senior Software Engineer, I will give you the code, list all the object you don't have the source code or you don't have any knowledge about it. ONLY OUTPUT OBJECT NAME SEPERATE BY ,"
PYTHON_IMPORT_TEMPLATE = """
object1,object2,objectx,objecty
"""
PYTHON_CORRECTION_EXPERT_ASSUMPTION = "Assume you are an Senior Software Engineer, I will give you a target the code, and the dependency code in target code. Could you help me check if there are any mistakes in target python code based on the dependency codes. For exmaple, wrong functions, wrong parameters and grammar mistakes."
PYTHON_CODE_BLOCK_TEMPLATE = "Based on the provided code and its dependencies, please correct all the mistakes ans misuse of functions and paramters. You should only output the FINAL CODE BLOCK. IF NO MISTAKE PLEASE OUT PUT FINAL CODE AS WELL"


### V2 Prompt
SDE_CHAT_ADVISOR_ASSUMPTION = f"""Assume you are software engineer, 
please answer the question base on the code plan I provide. And always input the Markdown clean format """

### code chat Prompt
SDE_CODE_CHAT_ASSUMPTION = f"""Assume you are a senior software engineer, 
Try to answer the user input base on Related Code Files.
If there is no related content then response base on your professional knowledge. 
And indicate there is no related content in the workplace."""

SDE_NOTION_CHAT_ASSUMPTION = f"""Assume you are a senior software engineer, 
answer User In[ut] always base on Related Notion Files. If there is no related content
then response base on your professional knowledge. And indicate there is no related content in the workplace."""

CODE_SUMMARY_V2 = f"""
Assume you are Senior Software engineer, help me summary code file based on the following criteria:
Always from Class, Function, Variable naming, code logic, and your professional knowledge to summary a code file.
Word Limit: Ensure the summary is less than 100 words in total.
Professional Analysis Summary:
Code's Purpose: Describe the primary objective or role of the code.
Problem Addressed: Explain the specific problem or issue that the code solves.
Output format
1. Code's Purpose:[Your description here]

2. Problem Addressed:[Your description here]

"""


SCHEMA_DESIGN_PRINCIPLE = """
                NOTICE
                Role: You are a professional database engineer; the main goal is to follow user requirement to design a NoSQL collection schema.
                ATTENTION: Output format carefully referenced "Format example".
                ATTENTION: Only design ONE collection. Be concise, only includes the necessary property fields in this collection. 
                ATTENTION: DO NOT MODIFY id part. Only change name in the curly brackets. The output must not contain curly brackets.
                ATTENTION: Only select the property types from 'timestamp', 'True', 'False' or data['{Property_name}']. Do not improvise field types.
                ***Format example***
                -----
                ```
                ##Collection##: {name}
                'id': str(uuid.uuid1()),
                '{Property_name1}': data['{Property_name1}'],
                '{Property_name2}': data['{Property_name2}'],
                '{Property_name3}': False,
                'createdAt': timestamp,
                'updatedAt': timestamp,
                ```
                -----
"""

RELATED_CODE_FILTER_ASSUMPTION = f"""
Assume you're a Senior Software Engineer tasked with creating a concise implementation plan for specific requirements, 
based on existing code files and their summaries. Please identify which code files are related or as dependencies,
which ones require modification, and which files are unrelated and won't be used. List all the files you'll need for dependencies and modifications, as well as those you won't use.
ATTENTION: When the input is start with the format [file name, file name...], the task is to search for the most similar file names within the 'Code Files' I provided below and then HAVE TO output ALL OF these files as the required files.
ATTENTION: ALWAYS OUTPUT AS FOLLOW FORMAT DON'T OUTPUT ANYOTHERS:
Required:[file name, file name...]
Unuse:[file name, file name...]"""

def get_custom_skills_assumption_role_prompt(question_subject):
    return f"""Assume you are the expert of {question_subject}. 
I want to know the list of top 5 essential actual hard skills (no softskill) for the {question_subject}. Can you please list them for me and use && sign to seperate them?"""

def build_gpt_prompt(role_assumption: str, output_format: str):
    return f"{role_assumption}\n\nAlways follow the Output format which is: {output_format}"

def build_gpt_standard_prompt(role_assumption: str, description: str, output_format: str):
    return f"{role_assumption}\n\nThis task description: {description}\n\n Output format: {output_format}"

def build_custom_skill_gpt_prompt(role_assumption: str, instruction: str, principles: str, few_shots: str):
    return f'''{role_assumption}\n\n 
    Here are instruction, always response follow the instruction: {instruction}\n\n
    Here are principles you need to always follow when give the response: {principles}\n\n 
    Here are the prompt and completion examples: {few_shots}
    If no suitable content then response base on your professional knowledge. '''

def llama_v2_prompt(messages):
    """
    Convert the messages in list of dictionary format to Llama2 compliant format.
    """
    B_INST, E_INST = "[INST]", "[/INST]"
    B_SYS, E_SYS = "<<SYS>>\n", "\n<</SYS>>\n\n"
    BOS, EOS = "<s>", "</s>"
    DEFAULT_SYSTEM_PROMPT = f"""You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Please ensure that your responses are socially unbiased and positive in nature. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information."""

    if messages[0]["role"] != "system":
        messages = [
            {
                "role": "system",
                "content": DEFAULT_SYSTEM_PROMPT,
            }
        ] + messages
    messages = [
        {
            "role": messages[1]["role"],
            "content": B_SYS + messages[0]["content"] + E_SYS + messages[1]["content"],
        }
    ] + messages[2:]

    messages_list = [
        f"{BOS}{B_INST} {(prompt['content']).strip()} {E_INST} {(answer['content']).strip()} {EOS}"
        for prompt, answer in zip(messages[::2], messages[1::2])
    ]
    messages_list.append(
        f"{BOS}{B_INST} {(messages[-1]['content']).strip()} {E_INST}")

    return "".join(messages_list)