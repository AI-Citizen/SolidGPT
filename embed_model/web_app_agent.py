import os.path

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
main_page_model = gpt_manager.create_model("gpt-3.5-turbo-16k",
                                           "Suppose you are a lowdefy developer."
                                           "You will create lowdefy yaml files given product requirement document."
                                           "You must follow theses principles."
                                           "1. Do not generate actions."
                                           # "2. Block type can only be selected from TextInput, TextArea, Paragraph, Menu, Card, Content, ButtonSelector. No other types are allowed."
                                           "2. Only use TextInput, TextArea, Paragraph, Menu, Card, Content, ButtonSelector as blocks type."
                                           "3. Do not import plugins that are not already built."
                                           "4. Do not generate reference pages (fields with '_ref')."
                                           "5. Do not create functions or events."
                                           "6. Do not generate duplicate map keys in yaml file."
                                           "7. Always Keep the yaml file less than 200 lines."
                                           "8. Always use lowdefy version 4.0.0-rc.10",
                                           "9. Nested mappings are forbidden, each line must only has one colon. "
                                           "block model")


def email_auth():
    main_page_model.add_background(
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


def parse_yaml_file(filename):
    with open(filename) as f:
        lines = f.readlines()
    return "".join(lines)


# print(parse_yaml_file(os.path.join("DATA", "analytics.yaml")))


def add_all_background():
    main_page_model.add_background(
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

    main_page_model.add_background(
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

    main_page_model.add_background(
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

    main_page_model.add_background(
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

    main_page_model.add_background(
        """
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
        """
    )

    # main_page_model.add_background(
    #     """
    # Task: Create yaml file for the blog home page referred in lowdefy.yaml using filename 'home.yaml'
    # Answer:
    # ```yaml
    # id: home
    # type: PageHeaderMenu
    # properties:
    #   title: Home # The title in the browser tab.
    # layout:
    #   contentJustify: center # Center the contents of the page.
    #
    # requests:
    #   - id: get_blog_posts
    #     type: MongoDBFind
    #     connectionId: blog_posts
    #     properties:
    #       query:
    #         blog_post_title:
    #           $ne: null
    #       options:
    #         sort:
    #           - - updated_at
    #             - -1
    #   - id: update_blog_post_likes
    #     type: MongoDBUpdateOne # MongoDb updateOne request to update the blog_post.
    #     connectionId: blog_posts
    #     properties:
    #       filter:
    #         _id:
    #           _state: _id # Select the document that matches the document's _id that is in state.
    #       update:
    #         $set:
    #           blog_post_likes:
    #             _sum:
    #               - _state: blog_post_likes
    #               - 1
    #   - id: search_blog_posts
    #     type: MongoDBAggregation
    #     connectionId: blog_posts
    #     properties:
    #       pipeline:
    #         - $match:
    #             $expr:
    #               $and:
    #                 - $or:
    #                   - $ne:
    #                       - $indexOfCP:
    #                         - $toLower:
    #                             $blog_post_title
    #                         - $toLower:
    #                             $ifNull:
    #                               - _state: search_input
    #                               - ''
    #                       - -1
    #                   - $ne:
    #                       - $indexOfCP:
    #                         - $toLower:
    #                             $blog_post_description
    #                         - $toLower:
    #                             $ifNull:
    #                               - _state: search_input
    #                               - ''
    #                       - -1
    #                 - $eq:
    #                     - $blog_post_flair
    #                     - $ifNull:
    #                         - _state: flair_selector
    #                         - $blog_post_flair
    #         - $sort:
    #             updated_at: -1
    #
    # events:
    #   onEnter:
    #     # Get the data from get_blog_posts
    #     - id: fetch_blog_posts
    #       type: Request
    #       params:
    #         - get_blog_posts
    #     # Set the data from get_blog_posts
    #     - id: set_blog_posts
    #       type: SetState
    #       params:
    #         blog_post_list:
    #           _request: get_blog_posts
    #
    # areas:
    #   content:
    #     justify: center
    #     blocks:
    #       - id: content_card
    #         type: Card
    #         style:
    #           maxWidth: 1000
    #         blocks:
    #           - id: content
    #             type: Result
    #             properties:
    #               title: Welcome to the Lowdefy Blog
    #               subTitle: A blog for all things tech related
    #               icon:
    #                 name: RobotOutlined
    #                 color: '#1890ff'
    #             areas:
    #               extra:
    #                 blocks:
    #                   - id: signup_login_box
    #                     type: Box
    #                     layout:
    #                       contentJustify: center
    #                       contentGutter: 6
    #                     blocks:
    #                       - id: signup_button
    #                         type: Button
    #                         visible:
    #                           _eq:
    #                             - _user: sub
    #                             - null
    #                         layout:
    #                           span: 5
    #                         properties:
    #                           size: large
    #                           title: Signup
    #                           icon: FormOutlined
    #                           type: primary
    #                         events:
    #                           onClick:
    #                             - id: login
    #                               type: Login
    #                               params:
    #                                 authUrlQueryParams:
    #                                   screen_hint: signup
    #                       - id: login_button
    #                         type: Button
    #                         visible:
    #                           _eq:
    #                             - _user: sub
    #                             - null
    #                         layout:
    #                           span: 5
    #                         properties:
    #                           size: large
    #                           title: Login
    #                           icon: LoginOutlined
    #                           type: primary
    #                         events:
    #                           onClick:
    #                             - id: link_to_login
    #                               type: Link
    #                               params: login
    #                       - id: logout_button
    #                         type: Button
    #                         visible:
    #                           _ne:
    #                             - _user: sub
    #                             - null
    #                         layout:
    #                           span: 5
    #                         properties:
    #                           size: large
    #                           title: Logout
    #                           icon: LogoutOutlined
    #                           type: primary
    #                         events:
    #                           onClick:
    #                             - id: logout
    #                               type: Logout
    #       # Search box
    #       - id: search_box
    #         type: Box
    #         style:
    #           maxWidth: 1000
    #           margin-top: 20
    #         layout:
    #           contentGutter: 6
    #         blocks:
    #           - id: search_input
    #             type: TextInput
    #             layout:
    #               flex: 1 1 auto
    #             properties:
    #               disabled:
    #                 _eq:
    #                   - _state: blog_posts_loading
    #                   - true
    #               placeholder: Search blog posts
    #               label:
    #                 disabled: true
    #             events:
    #               onPressEnter:
    #                 _ref: search-blog-posts.yaml
    #           - id: flair_selector
    #             type: Selector
    #             layout:
    #               span: 3
    #             properties:
    #               disabled:
    #                 _eq:
    #                   - _state: blog_posts_loading
    #                   - true
    #               label:
    #                 disabled: true
    #               placeholder: Flair
    #               options:
    #                 - Informative
    #                 - Update
    #                 - Fact
    #                 - Funny
    #                 - Patch
    #                 - Feedback
    #             events:
    #               onChange:
    #                 _ref: search-blog-posts.yaml
    #           - id: search_button
    #             type: Button
    #             layout:
    #               flex: 0 1 auto
    #             properties:
    #               disabled:
    #                 _eq:
    #                   - _state: blog_posts_loading
    #                   - true
    #               title: Search
    #               icon: SearchOutlined
    #             events:
    #               onClick:
    #                 _ref: search-blog-posts.yaml
    #       # A List block to display all the blog posts in the blog_post_list state variable
    #       - id: blog_post_list
    #         type: List
    #         style:
    #           maxWidth: 1000
    #         blocks:
    #           - id: blog_post_list_container
    #             type: Comment
    #             properties:
    #               _if:
    #                 test:
    #                   _eq:
    #                     - _state: blog_post_list.$.blog_post_flair
    #                     - Informative
    #                 then:
    #                   avatar:
    #                     color: '#122C6A'
    #                     content:
    #                       _state: blog_post_list.$.blog_post_likes
    #                 else:
    #                   _if:
    #                     test:
    #                       _eq:
    #                         - _state: blog_post_list.$.blog_post_flair
    #                         - Update
    #                     then:
    #                       avatar:
    #                         color: '#0044A4'
    #                         content:
    #                           _state: blog_post_list.$.blog_post_likes
    #                     else:
    #                       _if:
    #                         test:
    #                           _eq:
    #                             - _state: blog_post_list.$.blog_post_flair
    #                             - Fact
    #                         then:
    #                           avatar:
    #                             color: '#005BBF'
    #                             content:
    #                               _state: blog_post_list.$.blog_post_likes
    #                         else:
    #                           _if:
    #                             test:
    #                               _eq:
    #                                 - _state: blog_post_list.$.blog_post_flair
    #                                 - Funny
    #                             then:
    #                               avatar:
    #                                 color: '#3874DB'
    #                                 content:
    #                                   _state: blog_post_list.$.blog_post_likes
    #                             else:
    #                               _if:
    #                                 test:
    #                                   _eq:
    #                                     - _state: blog_post_list.$.blog_post_flair
    #                                     - Patch
    #                                 then:
    #                                   avatar:
    #                                     color: '#5A8DF8'
    #                                     content:
    #                                       _state: blog_post_list.$.blog_post_likes
    #                                 else:
    #                                   avatar:
    #                                       color: '#7EABFF'
    #                                       content:
    #                                         _state: blog_post_list.$.blog_post_likes
    #             blocks:
    #               - id: blog_post_list.$.blog_post_flair
    #                 type: Title
    #                 properties:
    #                   _if:
    #                     test:
    #                       _eq:
    #                         - _state: blog_post_list.$.blog_post_flair
    #                         - Informative
    #                     then:
    #                       content:
    #                         _state: blog_post_list.$.blog_post_flair
    #                       level: 4
    #                       color: '#122C6A'
    #                     else:
    #                       _if:
    #                         test:
    #                           _eq:
    #                             - _state: blog_post_list.$.blog_post_flair
    #                             - Update
    #                         then:
    #                           content:
    #                             _state: blog_post_list.$.blog_post_flair
    #                           level: 4
    #                           color: '#0044A4'
    #                         else:
    #                           _if:
    #                             test:
    #                               _eq:
    #                                 - _state: blog_post_list.$.blog_post_flair
    #                                 - Fact
    #                             then:
    #                               content:
    #                                 _state: blog_post_list.$.blog_post_flair
    #                               level: 4
    #                               color: '#005BBF'
    #                             else:
    #                               _if:
    #                                 test:
    #                                   _eq:
    #                                     - _state: blog_post_list.$.blog_post_flair
    #                                     - Funny
    #                                 then:
    #                                   content:
    #                                     _state: blog_post_list.$.blog_post_flair
    #                                   level: 4
    #                                   color: '#3874DB'
    #                                 else:
    #                                   _if:
    #                                     test:
    #                                       _eq:
    #                                         - _state: blog_post_list.$.blog_post_flair
    #                                         - Patch
    #                                     then:
    #                                       content:
    #                                         _state: blog_post_list.$.blog_post_flair
    #                                       level: 4
    #                                       color: '#5A8DF8'
    #                                     else:
    #                                       content:
    #                                         _state: blog_post_list.$.blog_post_flair
    #                                       level: 4
    #                                       color: '#7EABFF'
    #               - id: blog_post_list.$.updated_at
    #                 type: Html
    #                 properties:
    #                   html:
    #                     _nunjucks:
    #                       template: |
    #                         <p style="font-size: 10px;text-transform: uppercase; font-weight: bold; margin-left: 5px">{{ updated_at | date("lll") }}</p>
    #                       on:
    #                         _state: blog_post_list.$
    #               - id: blog_post_card
    #                 type: Card
    #                 blocks:
    #                 - id: blog_post_list.$.blog_post_title
    #                   type: Title
    #                   properties:
    #                     content:
    #                       _state: blog_post_list.$.blog_post_title
    #                     level: 4
    #                 - id: blog_post_list.$.blog_post_description
    #                   type: Paragraph
    #                   properties:
    #                     content:
    #                       _state: blog_post_list.$.blog_post_description
    #                 - id: like_blog_post_button
    #                   type: Button
    #                   visible:
    #                     _eq:
    #                       - _user: sub
    #                       - null
    #                   layout:
    #                     span: 2
    #                   properties:
    #                     size: small
    #                     title: Like
    #                     icon: LikeOutlined
    #                     type: primary
    #                   events:
    #                     onClick:
    #                       - id: set_blog_post_id
    #                         type: SetState
    #                         params:
    #                           _id:
    #                             _state: blog_post_list.$._id
    #                           blog_post_likes:
    #                             _state: blog_post_list.$.blog_post_likes
    #                       - id: update_blog_post_likes # Call the update_blog_post_likes request.
    #                         type: Request
    #                         params: update_blog_post_likes
    #                       # After liking update blog_post_list
    #                       - id: fetch_blog_posts
    #                         type: Request
    #                         params:
    #                           - get_blog_posts
    #                       - id: set_blog_posts
    #                         type: SetState
    #                         params:
    #                           blog_post_list:
    #                             _request: get_blog_posts
    #                 - id: edit_blog_post_button
    #                   type: Button
    #                   visible:
    #                     _ne:
    #                       - _user: sub
    #                       - null
    #                   layout:
    #                     span: 2
    #                   properties:
    #                     size: small
    #                     title: Edit
    #                     icon: EditOutlined
    #                     type: primary
    #                   events:
    #                     onClick:
    #                       - id: edit_blog_post_link
    #                         type: Link
    #                         params:
    #                           pageId: edit-blog-post # The page id of the edit blog_post page.
    #                           urlQuery:
    #                             blog_post_id:
    #                               _state: blog_post_list.$._id # Set the blog_post_id in the url query on the edit-blog-post page to the _id field of the clicked list item.
    #
    #   footer:
    #     blocks:
    #       - id: footer
    #         type: Paragraph
    #         properties:
    #           type: secondary
    #           content: |
    #             Made using Lowdefy
    #         style:
    #           text-align: center
    #       - id: block_id
    #         type: Icon
    #         properties:
    #           name: RobotOutlined
    #         style:
    #           text-align: center
    # ```
    #     """
    # )
    return


# output = summarize_model.chat_with_model(
#     "Task: "
#     "Read this Product Requirement Document(PRD):"
#     "2.2 Account Management Page"
#     "Users can access the account management page from the main website."
#     "The account management page should allow users to edit their account information, including email, phone number, and password."
#     "Users should be able to logout from their account."
#     "Create the yaml file that implements this product requirement document with the name account_management.yaml.")

# 2.3 Sign In/Sign Up View
# Users should be able to access the sign in/sign up view from the main website.
# The sign in/sign up view should include options for signing in or creating a new account.
# Once signed in, users can access their account management page and the main website.
#

def run1():
    add_all_background()
    output = main_page_model.chat_with_model(
        "Task: "
        "Read this Product Requirement Document(PRD):"
        "2.1 Main Website Page"
        "Users can access the main website page."
        "Users can input messages and chat with an AI chatbot to inquire about stocks."
        "The AI chatbot should be able to answer questions related to stocks and provide "
        "analysis based on financial reports."
        "The chat interface should be user-friendly and intuitive."
        "The main website page should have a menu located on the left side."
        "The menu should include buttons for account management and favorite stocks."
        "Create the yaml file that implements this product requirement document with the name lowdefy.yaml.")
    print(output)


run1()
# """
# 其中一个bug free结果
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