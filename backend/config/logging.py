import logging

def setup_logging(log_to_file: bool = False, log_file: str = "app.log"):
    """
    Sets up logging with INFO level. Logs to console by default.
    Optionally logs to a file if `log_to_file` is True.
    
    Args:
        log_to_file (bool): Whether to log to a file.
        log_file (str): Path to the log file.
    """
    handlers = [logging.StreamHandler()]
    
    if log_to_file:
        handlers.append(logging.FileHandler(log_file))
    
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=handlers
    )
