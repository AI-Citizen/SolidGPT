import openai


class GPTManager:
    def __init__(self, if_show_reply=False):
        # read api key from config file
        openai.api_key = "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"
        self.gpt_models_container = {}
        self.if_show_reply = if_show_reply

    def create_model(self, model, prompt, gpt_model_label, temperature=1):
        gpt_model = GPTModel(prompt, model, self.if_show_reply, temperature)
        self.gpt_models_container[gpt_model_label] = gpt_model
        return gpt_model


class GPTModel:
    def __init__(self, prompt, model, if_show_reply=True, temperature=1):
        self.prompt = prompt
        self.model = model
        self.messages = [{"role": "system", "content": self.prompt}]
        self.last_reply = None
        self.if_show_reply = if_show_reply
        self.temperature = temperature

    def chat_with_model(self, input_message):
        self.messages.append({"role": "user", "content": input_message})
        self._run_model()
        return self.last_reply

    def _run_model(self):
        chat = openai.ChatCompletion.create(
            model=self.model,
            messages=self.messages,
            temperature=self.temperature,
        )
        reply = chat.choices[0].message.content
        if self.if_show_reply:
            print(f"ChatGPT: {reply}")
        self.messages.append({"role": "assistant", "content": reply})
        self.last_reply = reply

    def add_background(self, background_message):
        self.messages.append({"role": "assistant", "content": background_message})

gpt_manager = GPTManager()


def create_category_model():
    category_model = gpt_manager.create_model("gpt-3.5-turbo",
                                              "Suppose you are a software developer. Read this documentation page "
                                              "https://docs.lowdefy.com. You need to determine if the given prompt wants to"
                                              "1. create a block 2. create an action "
                                              "3. create a connection 4. create a requests. You should only answer in a "
                                              "single number",
                                              "category model")
    return


# block_model = gpt_manager.create_model("gpt-3.5-turbo",
#                                        "Suppose you are a lowdefy developer. Any yaml files you create will strickly follow lowdefy documentations."
#                                        "Read this documentation https://docs.lowdefy.com/block and follows the rules in this documentation exactly."
#                                        "You will only provide yaml files and do not need to provide explanations.",
#                                        "block model")

# model.add_background("Read this documentation page: https://docs.lowdefy.com/TextInput. "
#                      "You need to follow how yaml files are written on this page exactly.")

# print(block_model.chat_with_model("""
# ```
# blocks:
#     id: block_id
#     type: TextInput
#     properties:
#       label:
#         inline: true
# ```
# I want to make this text input block required."""))


# summarize_model = gpt_manager.create_model("gpt-3.5-turbo",
#                                        "Suppose you are a lowdefy developer."
#                                        "Read this documentation https://docs.lowdefy.com/block and follows the rules in this documentation exactly."
#                                        "You will summarize what will the yaml creates.",
#                                        "block model")

# print(summarize_model.chat_with_model("""
# ```
# blocks:
#     id: block_id
#     type: TextInput
#     required: true
#     properties:
#       label:
#         inline: true
# ```
# What does this yaml file create. Summarize in 30 words in human language"""))
# This YAML file creates a block with the id "block_id" of type "TextInput". The block has a property called "label" with the inline property set to true. The property "label" is used to display a label for the TextInput block, and the "inline" property determines whether the label should be displayed inline with the input field or on a new line.

summarize_model = gpt_manager.create_model("gpt-3.5-turbo",
                                           "Suppose you are a lowdefy developer."
                                           "You will create lowdefy yaml files given product requirement document."
                                           "You must follow theses principles."
                                           "1. Do not generate actions."
                                           "2. Block types can only be TextInput, TextArea, Paragraph, Menu, Card, Content, ButtonSelector."
                                           "3. Do not import plugins that are not already built."
                                           "4. Do not refer pages that are not created yet."
                                           "5. Do not create functions."
                                           "6. Do not generate duplicate map keys in yaml file."
                                           "7. Keep the yaml file less than 100 lines.",
                                           "block model")


summarize_model.add_background(
    """
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
    """
)


summarize_model.add_background(
"""
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
```""")


def email_auth():
    summarize_model.add_background(
    """
    Task: Create a main front page yaml file for an app in which user can sign in using email authorization with the name lowdefy.yaml
    Answer:
    ```yaml
    lowdefy: 4.0.0-rc.7
    version: 0.0.0
    name: Ingrain CRM
    
    cli:
      disableTelemetry: true
      watch:
        - ../shared
    
    plugins:
      - name: 'lowdefy-example-auth-email'
        version: 'workspace:*'
    
    config:
      homePageId: login
    
    auth:
      authPages:
        signIn: '/login'
        verifyRequest: '/verify-email-request'
      adapter:
        id: mdb_adapter
        type: MongoDBAdapter
        properties:
          invite:
            required: true # Set to false to allow sign-ups without an invite
          databaseUri:
            _secret: MONGODB_URI
    
      providers:
        - id: email
          type: EmailProvider
          properties:
            # Configure SMTP server as described here:
            # https://next-auth.js.org/providers/email
            # Any SMTP server can be used
            server:
              host: smtp.sendgrid.net
              port: 465
              auth:
                user: apikey
                pass:
                  _secret: SENDGRID_API_KEY
            from:
              _secret: AUTH_FROM_EMAIL_ADDRESS
      userFields:
        id: user.id
        profile: user.profile
        app_attributes: user.app_attributes
        roles: user.roles
      pages:
        protected: true
        public:
          - login
          - logged-out
          - '404'
          - signup
          - verify-email-request
        roles:
          admin:
            - users
            - invites
            - new-invite
            - edit-user
    
    connections:
      _ref: connections.yaml
    
    menus:
      _ref: menus.yaml
    
    pages:
      - _ref: pages/protected-page/protected-page.yaml
      - _ref: pages/users/create-profile.yaml
      - _ref: pages/users/edit-invite.yaml
      - _ref: pages/users/edit-profile.yaml
      - _ref: pages/users/edit-user.yaml
      - _ref: pages/users/invites.yaml
      - _ref: pages/users/logged-in.yaml
      - _ref: pages/users/logged-out.yaml
      - _ref: pages/users/login.yaml
      - _ref: pages/users/new-invite.yaml
      - _ref: pages/users/profile.yaml
      - _ref: pages/users/users.yaml
      - _ref: pages/users/verify-email-request.yaml
      - _ref: pages/404/404.yaml
    ```
    """)


summarize_model.add_background(
    """
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
"""
)


summarize_model.add_background(
    """
Task: Create a report page that is referred in lowdefy.yaml with the name report.yaml
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
    """
)

# summarize_model.add_background(
#     "Product Requirement Document:"
#     "2.1 Main Website Page"
#     "Users can access the main website page."
#     "Users can input messages and chat with an AI chatbot to inquire about stocks."
#     "The AI chatbot should be able to answer questions related to stocks and provide "
#     "analysis based on financial reports."
#     "The chat interface should be user-friendly and intuitive."
#     "The main website page should have a menu located on the left side."
#     "The menu should include buttons for account management and favorite stocks.")


# output = summarize_model.chat_with_model(
#     "Task: "
#     "Read this Product Requirement Document(PRD):"
#     "2.1 Main Website Page"
#     "Users can access the main website page."
#     "Users can input messages and chat with an AI chatbot to inquire about stocks."
#     "The AI chatbot should be able to answer questions related to stocks and provide "
#     "analysis based on financial reports."
#     "The chat interface should be user-friendly and intuitive."
#     "The main website page should have a menu located on the left side."
#     "The menu should include buttons for account management and favorite stocks."
#     "Create the yaml file that fully implements this product requirement document with the name lowdefy.yaml.")

# output = summarize_model.chat_with_model(
#     "Task: "
#     "Read this Product Requirement Document(PRD):"
#     "2.1 Main Website Page"
#     "Users can access the main website page."
#     "Users can input messages and chat with an AI chatbot to inquire about stocks."
#     "The AI chatbot should be able to answer questions related to stocks and provide "
#     "analysis based on financial reports."
#     "The chat interface should be user-friendly and intuitive."
#     "The main website page should have a menu located on the left side."
#     "The menu should include buttons for account management and favorite stocks."
#     "Create the yaml file that implements this product requirement document with the name lowdefy.yaml.")

output = summarize_model.chat_with_model(
    "Task: "
    "Read this Product Requirement Document(PRD):"
    "2.2 Account Management Page"
    "Users can access the account management page from the main website."
    "The account management page should allow users to edit their account information, including email, phone number, and password."
    "Users should be able to logout from their account."
    "Create the yaml file that implements this product requirement document with the name account_management.yaml.")

# 2.3 Sign In/Sign Up View
# Users should be able to access the sign in/sign up view from the main website.
# The sign in/sign up view should include options for signing in or creating a new account.
# Once signed in, users can access their account management page and the main website.
#

print(output)

# """
# Answer:
# ```yaml
# lowdefy: 4.0.0-rc.10
# name: Stock Inquiry
# menus:
#   - id: default
#     links:
#       - id: main
#         type: MenuLink
#         properties:
#           icon: AiOutlineHome
#           title: Main
#         pageId: main
#       - id: account-management
#         type: MenuLink
#         properties:
#           icon: AiOutlineUser
#           title: Account Management
#         pageId: account-management
#       - id: favorite-stocks
#         type: MenuLink
#         properties:
#           icon: AiOutlineStar
#           title: Favorite Stocks
#         pageId: favorite-stocks
#
# pages:
#   - id: main
#     type: PageHeaderMenu
#     properties:
#       title: Main Website Page
#     areas:
#       content:
#         blocks:
#           - id: chat_area
#             type: Card
#             blocks:
#               - id: chat_input
#                 type: TextInput
#                 properties:
#                   placeholder: Enter your message
#               - id: chat_button
#                 type: Button
#                 properties:
#                   title: Send
#               - id: chat_messages
#                 type: Content
#                 properties:
#                   content: []
#       footer:
#         blocks:
#           - id: footer_content
#             type: Content
#             properties:
#               content: |
#                 Made by a Lowdefy
#   - id: account-management
#     type: PageHeaderMenu
#     properties:
#       title: Account Management
#     areas:
#       content:
#         blocks:
#           - id: account_card
#             type: Card
#             blocks:
#               - id: account_info
#                 type: Paragraph
#                 properties:
#                   content: Manage your account here.
#       footer:
#         blocks:
#           - id: footer_content
#             type: Content
#             properties:
#               content: |
#                 Made by a Lowdefy
#   - id: favorite-stocks
#     type: PageHeaderMenu
#     properties:
#       title: Favorite Stocks
#     areas:
#       content:
#         blocks:
#           - id: favorite_card
#             type: Card
#             blocks:
#               - id: favorite_info
#                 type: Paragraph
#                 properties:
#                   content: Manage your favorite stocks here.
#       footer:
#         blocks:
#           - id: footer_content
#             type: Content
#             properties:
#               content: |
#                 Made by a Lowdefy
# ```
# """