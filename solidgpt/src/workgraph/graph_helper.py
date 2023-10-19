
from enum import Enum
import uuid


class GraphType(Enum):
    OnboardingGraph = 1
    WritePRDGraph = 2
    ProvideTechSolutionGraph = 3
    RepoChat = 4

class GraphStatus(Enum):
    NotStarted = 0
    Running = 1
    Completed = 2
    Failed = 3