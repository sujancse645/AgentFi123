import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTransactions, type Transaction } from "@/hooks/useTransactions";
import type { ActionKind } from "@/lib/intentParser";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ITEMS_PER_PAGE = 10;

const TransactionIcon = ({ type }: { type: ActionKind }) => {
  const icons: Record<ActionKind, React.ElementType> = {
    swap: ArrowRightLeft,
    buy: ArrowDownRight,
    sell: ArrowUpRight,
    send: Send,
    dca: RefreshCw,
    limit: ArrowRightLeft,
    stop_loss: ArrowUpRight,
    take_profit: ArrowDownRight,
    arbitrage: ArrowRightLeft,
    stake: ArrowDownRight,
    rebalance: RefreshCw,
    multi_hop: ArrowRightLeft,
  };
  const Icon = icons[type] || ArrowRightLeft;
  return <Icon className="h-4 w-4" />;
};

const StatusBadge = ({ status }: { status: Transaction["status"] }) => {
  const config = {
    confirmed: {
      icon: CheckCircle2,
      label: "Confirmed",
      className: "border-teal/30 bg-teal/10 text-teal",
    },
    pending: {
      icon: Clock,
      label: "Pending",
      className: "border-warning/30 bg-warning/10 text-warning",
    },
    failed: {
      icon: XCircle,
      label: "Failed",
      className: "border-destructive/30 bg-destructive/10 text-destructive",
    },
  };
  const { icon: Icon, label, className } = config[status];

  return (
    <Badge variant="outline" className={cn("gap-1", className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

const RiskBadge = ({ level }: { level: Transaction["riskLevel"] }) => {
  const config = {
    safe: { label: "Safe", className: "border-teal/30 bg-teal/10 text-teal" },
    caution: { label: "Caution", className: "border-warning/30 bg-warning/10 text-warning" },
    danger: { label: "Danger", className: "border-destructive/30 bg-destructive/10 text-destructive" },
  };
  const { label, className } = config[level];

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

export default function Transactions() {
  const { publicKey } = useWallet();
  const { transactions, clearTransactions, stats, loading } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Transaction["status"]>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | Transaction["type"]>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      searchQuery === "" ||
      tx.fromToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.toToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.intent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.signature.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    const matchesType = typeFilter === "all" || tx.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleClear = () => {
    clearTransactions();
    setClearDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage your trading history
          </p>
        </div>
        {transactions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive"
            onClick={() => setClearDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-display text-2xl font-semibold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-teal/30 bg-teal/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Successful</p>
            <p className="font-display text-2xl font-semibold text-teal">
              {stats.successful}
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="font-display text-2xl font-semibold text-warning">
              {stats.pending}
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Volume</p>
            <p className="font-display text-2xl font-semibold">
              ${stats.totalVolume.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by token, intent, or signature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="swap">Swap</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
                <SelectItem value="send">Send</SelectItem>
                <SelectItem value="dca">DCA</SelectItem>
                <SelectItem value="limit">Limit Order</SelectItem>
                <SelectItem value="stop_loss">Stop Loss</SelectItem>
                <SelectItem value="take_profit">Take Profit</SelectItem>
                <SelectItem value="arbitrage">Arbitrage</SelectItem>
                <SelectItem value="stake">Stake</SelectItem>
                <SelectItem value="rebalance">Rebalance</SelectItem>
                <SelectItem value="multi_hop">Multi-hop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display text-base">
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading transactions...
            </div>
          ) : paginatedTransactions.length > 0 ? (
            <div className="divide-y divide-border">
              {paginatedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <TransactionIcon type={tx.type} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </span>
                        <StatusBadge status={tx.status} />
                        <RiskBadge level={tx.riskLevel} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tx.fromAmount} {tx.fromToken} → {tx.toAmount}{" "}
                        {tx.toToken}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString()} · Route: {tx.route}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${tx.usdValue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      Fee: {tx.networkFee.toFixed(5)} SOL
                    </p>
                    <a
                      href={`https://explorer.solana.com/tx/${tx.signature}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No transactions found</p>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border p-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of{" "}
                {filteredTransactions.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clear Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Clear Transaction History</DialogTitle>
            <DialogDescription>
              This will permanently delete all your transaction history. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setClearDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
