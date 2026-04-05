class SensorDB:
    def __init__(self):
        self.data = [] # All readings even old ones
        self.data_recent = {} # Only most recent reading for a specific sensor

    def store(self, sensor_data):
        self.data.append(sensor_data)
        self.data_recent[sensor_data.id] = sensor_data
        return True

    def get_all(self):
        return self.data

    def get_recent_data(self):
        return self.data_recent
