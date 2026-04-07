def format_metric(metric, value):
    if metric == "Temp":
        return f"{value}°C"
    elif metric == "AQI":
        return f"AQI {value}"
    elif metric == "Humidity":
        return f"{value}%"
    elif metric == "Noise":
        return f"{value}dB"
    else:
        return f"{value}"