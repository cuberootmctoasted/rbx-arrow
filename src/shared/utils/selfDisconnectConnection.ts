export function selfDisconnectConnection(
    callback: (disconnect: () => void) => RBXScriptConnection,
) {
    let conn: RBXScriptConnection | undefined = undefined;
    function disconnect() {
        if (conn === undefined) return;
        if (!conn.Connected) return;
        conn.Disconnect();
    }
    conn = callback(disconnect);
}
