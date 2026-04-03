class SensorDB:
    def __init__(self):
        self.data = []

    def store(self, sensor_data):
        self.data.append(sensor_data)
        return True

    def get_all(self):
        return self.data