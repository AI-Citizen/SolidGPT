class DisplayResult:
    result: str = ""
    custom_result = None

    def __init__(self):
        self.result = "No result"

    def set_result(self, s):
        self.result = s

    def get_result(self):
        return self.result

    def set_custom_result(self, data):
        self.custom_result = data

    def get_custom_result(self):
        return self.custom_result
