class DisplayResult:
    result: str = ""

    def __init__(self):
        self.result = "No result"

    def set_result(self, s):
        self.result = s

    def get_result(self):
        return self.result
