# FantasyDraft Prototype
## A Fantasy Football Draft App Written in Django and React

FantasyDraft is a mock-up of a fantasy football draft website, where users can create leagues and draft teams for an upcoming NFL football season.  While feature limited at the moment, it does contain the base logic to allow users to create accounts, to invite friends to leagues, to draft in real time, leave and rejoin active drafts and view the results of a completed drafts.  Utilizing React and Django-Channels, FantasyDraft can serve this experience as an SPA, providing a streamlined experience with minimal loading times.  The Bootstrap CSS framework is utilized to give a modern sheen to our user interface, with a few tweaks in a custom style class.

### Demonstration
A video demonstrating the abilities of FantasyDraft can be seen (on Youtube)[https://youtu.be/TAqgxlCbyzQ].

### Backend
Beyond Django's standard suite of conveniences, we have also integrated Django-Channels to utilize the Websocket protocol to provide real time updates to all users in a draft as their draft proceeds.  Owing to the prototypical nature of this project, The API that we open to the front end is limited and focused directly on the features that are enabled.  The design is very much tailored to our needs on the front end, and some features which were not originally in the specification were added in the late moments of development, which added some extra complexity to our views that would, if development were to continue, need to be addressed through a refactor on both ends.  However rough it is though, it still provides the necessary ingredients to perform a fantasy football draft.

### Frontend
The frontend is a fairly large react app split across several files, bundled together through index.html.  Index.html also provides a cross-site request forgery token for all views, as well as relevant information necessary to render draft instances.  Lobby.js and logincontrol.js control user experience outside of a draft instance, while draft.js and its sibling files handle the rendering and logic required within a draft instance.  Styling is mostly controlled by the Bootstrap CSS framework, though there is a small amount of custom css included.  

### Note on Django-channels
Django channels has an open issue regarding requests which fail due to 'deadlock on the single executor thread' which requires FantasyDraft to bundle an older version of ASGIRef.  Just for thoroughness I'm including the issue link: https://github.com/django/channels/issues/1722 as well as the SO answer that lead to the ASGIRef requirement: https://stackoverflow.com/questions/68208931/django-runtimeerror-at-admin-users-user-1-change-single-thread-executor-alrea.
