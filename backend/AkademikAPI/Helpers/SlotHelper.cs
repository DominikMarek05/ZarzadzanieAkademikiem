using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace AkademikAPI.Helpers;

/// <summary>
/// Klasa pomocnicza do obsługi 12 dwugodzinnych slotów rezerwacji (00:00 - 24:00)
/// </summary>
public static class SlotHelper
{
    /// <summary>
    /// Generuje listę 12 slotów 2-godzinnych i sprawdza ich dostępność na podstawie stanu obiektu oraz listy rezerwacji.
    /// </summary>
    public static List<object> GenerateSlots(string status, IEnumerable<(TimeSpan? Start, TimeSpan? End)> reservations)
    {
        bool isAvailable = status.Equals("Available", StringComparison.OrdinalIgnoreCase);

        return Enumerable.Range(0, 12).Select(index =>
        {
            var start = TimeSpan.FromHours(index * 2);
            var end = TimeSpan.FromHours(index * 2 + 2);

            // Slot jest wolny, jeśli obiekt ma status Available i brak nakładającej się rezerwacji
            bool available = isAvailable && !reservations.Any(r =>
                (!r.Start.HasValue && !r.End.HasValue) || // rezerwacja całodzienna
                (r.Start.HasValue && r.End.HasValue && r.Start.Value < end && r.End.Value > start)
            );

            return (object)new
            {
                startTime = start.ToString(@"hh\:mm"),
                endTime = end == TimeSpan.FromHours(24) ? "00:00" : end.ToString(@"hh\:mm"),
                available
            };
        }).ToList();
    }

    /// <summary>
    /// Sprawdza poprawność wybranego przedziału godzinowego (musi trwać 2h i zaczynać się o parzystej godzinie).
    /// </summary>
    public static bool TryValidateTwoHourSlot(string startTimeStr, string endTimeStr, out TimeSpan startTime, out TimeSpan endTime, out string? errorMessage)
    {
        errorMessage = null;
        startTime = default;
        endTime = default;

        if (!TimeSpan.TryParseExact(startTimeStr, @"hh\:mm", CultureInfo.InvariantCulture, out startTime) ||
            !TimeSpan.TryParseExact(endTimeStr, @"hh\:mm", CultureInfo.InvariantCulture, out endTime))
        {
            errorMessage = "Nieprawidłowy format godziny.";
            return false;
        }

        if (startTime.TotalHours < 0 || startTime.TotalHours > 22 || startTime.TotalHours % 2 != 0)
        {
            errorMessage = "Wybrany przedział godzinowy jest nieprawidłowy.";
            return false;
        }

        var expectedEnd = startTime + TimeSpan.FromHours(2);
        if (expectedEnd == TimeSpan.FromHours(24) && endTime == TimeSpan.Zero)
        {
            endTime = TimeSpan.FromHours(24);
        }

        if (endTime != expectedEnd)
        {
            errorMessage = "Nieprawidłowy przedział godzinowy.";
            return false;
        }

        return true;
    }
}
